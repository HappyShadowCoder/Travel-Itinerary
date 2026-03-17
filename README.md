# 🗺️ MysTrip — AI Travel Itinerary Generator

> Built as a mini version of [MysTrip](https://mystrip.in)'s core feature — AI-powered personalized travel itineraries for Jaipur, Rajasthan.

**Live Demo:** `https://mystrip-demo.vercel.app` ← _update after deploy_

---

## ✨ What it does

Enter your preferences and get a **day-by-day AI-generated Jaipur itinerary** in seconds:

- 📅 Number of days (1–7)
- 💰 Budget (Budget / Mid-Range / Premium)  
- ❤️ Interests (History, Food, Adventure, Shopping, Art, Nature…)

The app calls **Gemini AI** to generate structured itineraries with place names, timings, and local tips — then saves everything to **MongoDB** so you can revisit past trips.

---

## 🛠️ Tech Stack

| Layer    | Tech                          |
|----------|-------------------------------|
| Frontend | React + Vite + React Router   |
| Backend  | Node.js + Express             |
| Database | MongoDB + Mongoose            |
| AI       | Google Gemini 1.5 Flash API   |
| Deploy   | Vercel (client) + Render (server) |

---

## 🚀 Run Locally

### Prerequisites
- Node.js 18+
- MongoDB running locally (or MongoDB Atlas URI)
- [Gemini API key](https://aistudio.google.com) (free)

### Backend
```bash
cd server
cp .env.example .env      # fill in your keys
npm install
npm run dev               # http://localhost:5000
```

### Frontend
```bash
cd client
cp .env.example .env
npm install
npm run dev               # http://localhost:5173
```

---

## 📁 Project Structure

```
mystrip/
├── server/
│   ├── config/db.js              # MongoDB connection
│   ├── models/Itinerary.model.js # Mongoose schema
│   ├── controllers/              # Gemini AI + CRUD logic
│   ├── routes/                   # Express routes
│   └── index.js                  # Server entry point
└── client/
    └── src/
        ├── api/itinerary.js      # Axios helpers
        ├── pages/
        │   ├── Home.jsx          # Generator form
        │   ├── Result.jsx        # Itinerary display
        │   └── History.jsx       # Past trips from DB
        └── App.jsx               # Router
```

---

## 🌐 API Endpoints

| Method | Endpoint                       | Description              |
|--------|--------------------------------|--------------------------|
| POST   | `/api/itineraries/generate`    | Generate + save itinerary |
| GET    | `/api/itineraries`             | List all past itineraries |
| GET    | `/api/itineraries/:id`         | Get one by ID             |
| GET    | `/api/health`                  | Health check              |

---

## 🏰 About MysTrip

MysTrip is a Jaipur-based startup building AI-powered travel experiences for Rajasthan — personalized itineraries, trekking, and curated place catalogues. This project was built to demonstrate their core feature using the MERN stack + Gemini AI.
