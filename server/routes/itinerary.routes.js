import express from "express";
import {
  generateItinerary,
  getAllItineraries,
  getItineraryById,
  deleteItinerary,
  getUsage,
} from "../controllers/itinerary.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/usage", protect, getUsage);
router.post("/generate", protect, generateItinerary);
router.get("/", protect, getAllItineraries);
router.get("/:id", protect, getItineraryById);
router.delete("/:id", protect, deleteItinerary);

export default router;