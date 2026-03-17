import mongoose from "mongoose";

const dayPlanSchema = new mongoose.Schema({
  day: Number,
  title: String,
  places: [
    {
      name: String,
      time: String,
      description: String,
      tip: String,
    },
  ],
});

const itinerarySchema = new mongoose.Schema(
  {
    destination: { type: String, default: "Jaipur" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    days: { type: Number, required: true },
    budget: { type: String, enum: ["budget", "mid", "premium"], required: true },
    interests: [String],
    itinerary: [dayPlanSchema],
    rawResponse: String, // store the full AI response too
  },
  { timestamps: true }
);

export default mongoose.model("Itinerary", itinerarySchema);
