import OpenAI from "openai";
import Itinerary from "../models/Itinerary.model.js";

let _openai;
const getOpenAI = () => {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
};

// Build a rich prompt for Jaipur travel
const buildPrompt = ({ destination, days, budget, interests }) => {
  const budgetMap = {
    budget: "budget-friendly (under ₹1500/day per person)",
    mid: "mid-range (₹1500–₹4000/day per person)",
    premium: "premium/luxury (₹4000+/day per person)",
  };

  return `
You are an expert local travel guide for Rajasthan, India.
Create a detailed ${days}-day travel itinerary for ${destination}, Rajasthan for a ${budgetMap[budget]} traveler.
Their interests: ${interests.join(", ")}.

Return ONLY valid JSON with this exact structure (no markdown, no explanation):
{
  "itinerary": [
    {
      "day": 1,
      "title": "Short catchy title for the day",
      "places": [
        {
          "name": "Place name",
          "time": "9:00 AM – 11:00 AM",
          "description": "2-3 sentences about this place and what to do",
          "tip": "One insider local tip"
        }
      ]
    }
  ]
}

Include 4–6 places per day. Mix must-sees with hidden gems based on their interests.
For budget travelers, prefer free/cheap spots and street food. 
For premium, include heritage hotels, fine dining, private tours.
Always include practical timings, local transport suggestions, and meal spots.
  `.trim();
};

// POST /api/itineraries/generate
export const generateItinerary = async (req, res) => {
  try {
    const { destination = "Jaipur", days = 2, budget = "mid", interests = ["history", "food"] } = req.body;

    if (!destination || destination.trim().length < 2)
      return res.status(400).json({ error: "Please provide a valid destination" });

    if (days < 1 || days > 10) {
      return res.status(400).json({ error: "Days must be between 1 and 10" });
    }

    const prompt = buildPrompt({ destination: destination.trim(), days, budget, interests });

    // Check daily usage limit (cache hits don't count)
    const DAILY_LIMIT = parseInt(process.env.DAILY_LIMIT) || 3;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayCount = await Itinerary.countDocuments({
      user: req.user._id,
      cached: { $ne: true },
      createdAt: { $gte: startOfDay },
    });

    if (todayCount >= DAILY_LIMIT) {
      return res.status(429).json({
        error: `Daily limit reached. You can generate ${DAILY_LIMIT} itineraries per day. Try again tomorrow or use a cached result.`,
        limitReached: true,
        limit: DAILY_LIMIT,
        used: todayCount,
      });
    }

    // Check cache — if identical trip exists, return it instead of calling AI
    const sortedInterests = [...interests].sort();
    const cached = await Itinerary.findOne({
      destination: destination.trim(),
      days,
      budget,
      interests: { $size: sortedInterests.length, $all: sortedInterests },
    }).select("-rawResponse");

    if (cached) {
      console.log(`✅ Cache hit for ${destination} ${days}d ${budget}`);
      return res.status(200).json({
        success: true,
        cached: true,
        id: cached._id,
        destination: cached.destination,
        days: cached.days,
        budget: cached.budget,
        interests: cached.interests,
        itinerary: cached.itinerary,
        createdAt: cached.createdAt,
      });
    }

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }, // guaranteed JSON back
      temperature: 0.8,
    });

    const rawText = completion.choices[0].message.content;

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      return res.status(500).json({ error: "AI returned invalid format. Try again." });
    }

    // Save to MongoDB
    const saved = await Itinerary.create({
      destination: destination.trim(),
      user: req.user._id,
      days,
      budget,
      interests,
      itinerary: parsed.itinerary,
      rawResponse: rawText,
    });

    res.status(201).json({
      success: true,
      id: saved._id,
      destination: destination.trim(),
      days,
      budget,
      interests,
      itinerary: parsed.itinerary,
      createdAt: saved.createdAt,
    });
  } catch (error) {
    console.error("Generate error:", error);
    res.status(500).json({ error: "Failed to generate itinerary. Check your API key." });
  }
};

// GET /api/itineraries — fetch all past itineraries
export const getAllItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ user: req.user._id })
      .select("-rawResponse")
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, count: itineraries.length, data: itineraries });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch itineraries" });
  }
};

// GET /api/itineraries/:id — fetch one
export const getItineraryById = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id).select("-rawResponse");
    if (!itinerary) return res.status(404).json({ error: "Itinerary not found" });
    res.json({ success: true, data: itinerary });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch itinerary" });
  }
};

// DELETE /api/itineraries/:id
export const deleteItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) return res.status(404).json({ error: "Itinerary not found" });

    // Make sure user owns it
    if (itinerary.user.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Not authorized" });

    await itinerary.deleteOne();
    res.json({ success: true, message: "Itinerary deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete itinerary" });
  }
};

// GET /api/itineraries/usage — today's usage for logged in user
export const getUsage = async (req, res) => {
  try {
    const DAILY_LIMIT = parseInt(process.env.DAILY_LIMIT) || 3;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const used = await Itinerary.countDocuments({
      user: req.user._id,
      cached: { $ne: true },
      createdAt: { $gte: startOfDay },
    });
    res.json({ used, limit: DAILY_LIMIT, remaining: Math.max(0, DAILY_LIMIT - used) });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch usage" });
  }
};