import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateItinerary, getUsage } from "../api/itinerary";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

const RAJASTHAN_PLACES = [
  "Jaipur", "Jodhpur", "Udaipur", "Jaisalmer", "Pushkar",
  "Ajmer", "Bikaner", "Mount Abu", "Ranthambore", "Chittorgarh",
  "Kumbhalgarh", "Bundi", "Alwar", "Bharatpur", "Mandawa",
];

const INTERESTS = [
  { id: "history", label: "🏰 History" },
  { id: "food", label: "🍛 Food" },
  { id: "adventure", label: "🧗 Adventure" },
  { id: "shopping", label: "🛍️ Shopping" },
  { id: "art", label: "🎨 Art & Culture" },
  { id: "nature", label: "🌿 Nature" },
  { id: "photography", label: "📸 Photography" },
  { id: "spiritual", label: "🕌 Spiritual" },
];

const DAY_VIBES = {
  1: { label: "Day Trip", emoji: "⚡" },
  2: { label: "Weekend Getaway", emoji: "🚗" },
  3: { label: "Long Weekend", emoji: "🏨" },
  4: { label: "Deep Dive", emoji: "🏛️" },
  5: { label: "Relaxed Pace", emoji: "🧘" },
  6: { label: "Great Explorer", emoji: "🗺️" },
  7: { label: "Grand Tour", emoji: "🕌" },
};

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [usage, setUsage] = useState(null);
  const [form, setForm] = useState({
    destination: "Jaipur",
    days: 2,
    budget: "mid",
    interests: ["history", "food"],
  });
  const [customPlace, setCustomPlace] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getUsage().then((res) => setUsage(res.data)).catch(() => {});
  }, []);

  const toggleInterest = (id) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter((i) => i !== id)
        : [...prev.interests, id],
    }));
  };

  const handleSubmit = async () => {
    if (form.interests.length === 0) return setError("Pick at least one interest.");
    const destination = useCustom ? customPlace.trim() : form.destination;
    if (!destination) return setError("Please enter a destination.");
    if (usage && usage.remaining === 0)
      return setError(`Daily limit reached (${usage.limit}/day). Come back tomorrow!`);
    
    setError("");
    setLoading(true);
    try {
      const res = await generateItinerary({ ...form, destination });
      if (!res.data.cached) {
        setUsage((prev) => prev ? { ...prev, used: prev.used + 1, remaining: prev.remaining - 1 } : prev);
      }
      navigate(`/result/${res.data.id}`, { state: res.data });
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const activeDestination = useCustom ? customPlace : form.destination;

  return (
    <div className="home">
      <nav className="navbar">
        <div className="nav-container">
          <span className="logo" onClick={() => navigate("/")}>🗺️ MysTrip</span>
          <div className="nav-right">
            <a href="/history" className="nav-link">Past Itineraries</a>
            <span className="nav-user">👋 {user?.name}</span>
            <button className="logout-btn" onClick={() => { logout(); navigate("/auth"); }}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="hero">
        <h1>Explore Rajasthan, <span>Your Way</span></h1>
        <p>AI-powered itineraries for the Land of Kings</p>
      </div>

      <div className="card form-card">
        {/* DESTINATION */}
        <div className="field">
          <label>📍 Destination</label>
          <div className="places-grid">
            {RAJASTHAN_PLACES.map((place) => (
              <button
                key={place}
                className={`place-btn ${!useCustom && form.destination === place ? "active" : ""}`}
                onClick={() => { setForm({ ...form, destination: place }); setUseCustom(false); }}
              >
                {place}
              </button>
            ))}
            <button
              className={`place-btn custom-btn ${useCustom ? "active" : ""}`}
              onClick={() => setUseCustom(true)}
            >
              ✏️ Other
            </button>
          </div>
          <div className={`custom-input-wrapper ${useCustom ? "visible" : ""}`}>
            <input
              className="custom-input"
              type="text"
              placeholder="Where in Rajasthan would you like to go?"
              value={customPlace}
              onChange={(e) => setCustomPlace(e.target.value)}
              autoFocus={useCustom}
            />
            <div className="input-icon">✨</div>
          </div>
        </div>

        {/* DYNAMIC DAYS SLIDER */}
        <div className="field">
          <div className="field-header">
            <label>📅 Duration: <strong>{form.days} Days</strong></label>
            <div className="vibe-badge" key={form.days}>
              <span>{DAY_VIBES[form.days].emoji} {DAY_VIBES[form.days].label}</span>
            </div>
          </div>
          <div className="slider-container">
            <input
              type="range"
              min={1} max={7}
              step={1}
              className="dynamic-slider"
              value={form.days}
              onChange={(e) => setForm({ ...form, days: +e.target.value })}
              style={{ '--pct': (form.days - 1) * 16.66 }}
            />
            <div className="slider-markers">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <span 
                  key={num} 
                  className={`marker ${form.days >= num ? "reached" : ""} ${form.days === num ? "current" : ""}`}
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* BUDGET */}
        <div className="field">
          <label>💰 Budget</label>
          <div className="budget-group">
            {[
              { value: "budget", label: "🎒 Budget", sub: "Under ₹1500/day" },
              { value: "mid", label: "✈️ Mid-Range", sub: "₹1500–₹4000/day" },
              { value: "premium", label: "👑 Premium", sub: "₹4000+/day" },
            ].map((b) => (
              <button
                key={b.value}
                className={`budget-btn ${form.budget === b.value ? "active" : ""}`}
                onClick={() => setForm({ ...form, budget: b.value })}
              >
                <span>{b.label}</span>
                <small>{b.sub}</small>
              </button>
            ))}
          </div>
        </div>

        {/* INTERESTS */}
        <div className="field">
          <label>❤️ Interests</label>
          <div className="interests-grid">
            {INTERESTS.map((i) => (
              <button
                key={i.id}
                className={`interest-btn ${form.interests.includes(i.id) ? "active" : ""}`}
                onClick={() => toggleInterest(i.id)}
              >
                {i.label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        {/* USAGE BAR */}
        {usage && (
          <div className="usage-bar">
            <div className="usage-info">
              <span>⚡ Daily AI Generations</span>
              <span className={usage.remaining === 0 ? "usage-none" : "usage-count"}>
                {usage.remaining === 0 ? "Limit reached" : `${usage.remaining} of ${usage.limit} left`}
              </span>
            </div>
            <div className="usage-track">
              <div
                className="usage-fill"
                style={{ width: `${(usage.used / usage.limit) * 100}%` }}
              />
            </div>
            <p className="usage-note">✅ Cached results are always free & instant</p>
          </div>
        )}

        <button 
          className="generate-btn" 
          onClick={handleSubmit} 
          disabled={loading || (usage && usage.remaining === 0)}
        >
          {loading ? (
            <span className="spinner-row">
              <span className="spinner" /> Crafting your {activeDestination} itinerary...
            </span>
          ) : (
            `✨ Generate ${activeDestination} Itinerary`
          )}
        </button>
      </div>
    </div>
  );
}