import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllItineraries, deleteItinerary } from "../api/itinerary";
import "./History.css";

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  // Initial Data Fetch
  useEffect(() => {
    getAllItineraries()
      .then((res) => {
        // Assuming API returns { data: { data: [...] } }
        setItems(res.data.data || []);
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  // Delete Handler with UI Protection
  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevents navigating to result page when clicking delete
    
    if (!window.confirm("Are you sure you want to permanently delete this itinerary?")) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteItinerary(id);
      // Optimistic Update: Remove from state immediately after successful API call
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert("Failed to delete. Please check your connection and try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const budgetLabel = { 
    budget: "🎒 Budget", 
    mid: "✈️ Mid-Range", 
    premium: "👑 Premium" 
  };

  return (
    <div className="history">
      <nav className="navbar">
        <div className="nav-container">
          <span className="logo" onClick={() => navigate("/")}>🗺️ MysTrip</span>
          <button className="new-trip-btn" onClick={() => navigate("/")}>
            <span>+</span> New Trip
          </button>
        </div>
      </nav>

      <header className="history-header">
        <h1>Past Itineraries</h1>
        <p>A collection of your AI-generated adventures in Rajasthan.</p>
      </header>

      <main className="history-content">
        {loading ? (
          <div className="status-container">
            <div className="spinner-main"></div>
            <p>Loading your travel history...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="status-container empty-state">
            <div className="empty-icon">🏜️</div>
            <h2>No trips found</h2>
            <p>Looks like you haven't planned any journeys yet.</p>
            <button className="cta-btn" onClick={() => navigate("/")}>
              Plan a Trip Now
            </button>
          </div>
        ) : (
          <div className="history-grid">
            {items.map((item) => (
              <article 
                key={item._id} 
                className="history-card" 
                onClick={() => navigate(`/result/${item._id}`)}
              >
                <div className="hcard-header">
                  <span className="location-tag">📍 {item.destination}</span>
                  <span className="budget-tag">{budgetLabel[item.budget]}</span>
                </div>

                <div className="hcard-body">
                  <h3>{item.days}-Day Itinerary</h3>
                  <div className="interests-row">
                    {item.interests?.slice(0, 3).map((interest) => (
                      <span key={interest} className="interest-pill">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="hcard-footer">
                  <time className="trip-date">
                    {new Date(item.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}
                  </time>
                  
                  <button
                    className={`delete-action-btn ${deletingId === item._id ? "loading" : ""}`}
                    onClick={(e) => handleDelete(e, item._id)}
                    disabled={deletingId === item._id}
                    title="Delete Itinerary"
                  >
                    {deletingId === item._id ? (
                      <div className="spinner-btn"></div>
                    ) : (
                      <>
                        <span className="icon-trash">🗑️</span>
                        <span className="label-trash">Delete</span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}