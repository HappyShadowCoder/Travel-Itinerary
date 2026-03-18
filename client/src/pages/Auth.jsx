import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <span className="logo">🗺️ Travel Itinerary</span>
        <h1>Welcome to the Land of Kings</h1>
        <p>AI-powered travel planning for Rajasthan</p>
      </div>

      <div className="auth-card card">
        <div className="auth-header">
          <h2>{mode === "login" ? "Welcome Back" : "Begin Your Journey"}</h2>
          <p className="auth-sub">
            {mode === "login" 
              ? "Sign in to access your itineraries" 
              : "Create an account to start exploring"}
          </p>
        </div>

        <div className="auth-form">
          {mode === "register" && (
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          )}

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          {error && <div className="error-box">{error}</div>}

          <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <span className="spinner-row">
                <span className="spinner" /> 
                {mode === "login" ? "Authenticating..." : "Creating Account..."}
              </span>
            ) : (
              mode === "login" ? "Sign In" : "Start Planning"
            )}
          </button>
        </div>

        <p className="auth-switch">
          {mode === "login" ? "New to MysTrip? " : "Already a traveler? "}
          <button 
            className="switch-toggle"
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
          >
            {mode === "login" ? "Create an Account" : "Sign In instead"}
          </button>
        </p>
      </div>
    </div>
  );
}