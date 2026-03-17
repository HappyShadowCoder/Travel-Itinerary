import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import itineraryRoutes from "./routes/itinerary.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.startsWith("http://localhost") || origin.endsWith(".vercel.app") || origin === process.env.CLIENT_URL) {
      callback(null, true);
    } else {
      callback(null, false); // reject silently, no error thrown
    }
  },
  credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/itineraries", itineraryRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "MysTrip API is running 🗺️" });
});

// Connect DB then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});