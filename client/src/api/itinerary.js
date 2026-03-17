import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const generateItinerary = (data) =>
  axios.post(`${BASE}/itineraries/generate`, data);

export const getAllItineraries = () =>
  axios.get(`${BASE}/itineraries`);

export const getItineraryById = (id) =>
  axios.get(`${BASE}/itineraries/${id}`);

export const deleteItinerary = (id) =>
  axios.delete(`${BASE}/itineraries/${id}`);

export const getUsage = () =>
  axios.get(`${BASE}/itineraries/usage`);