# 🗺️ Travel Itinerary — AI-Powered Travel Planner for Rajasthan

> A full-stack MERN + AI web app that generates personalized day-by-day travel itineraries for any destination in Rajasthan. Built as a mini version of [MysTrip](https://mystrip.in)'s core feature.

**Live Demo:** `travel-itinerary-git-main-happyshadowcoders-projects.vercel.app` 

---

## ✨ Features

- 🤖 **AI Itinerary Generation** — GPT-4o-mini generates detailed day-by-day plans
- 📍 **15 Rajasthan Destinations** — Jaipur, Udaipur, Jodhpur, Jaisalmer + custom input
- 💰 **Budget Picker** — Budget / Mid-Range / Premium with ₹ ranges
- ❤️ **Interest Tags** — History, Food, Adventure, Shopping, Art, Nature, Photography, Spiritual
- ⚡ **Smart Cache** — Identical trips served instantly from DB, no API call
- 🔒 **JWT Auth** — Register, login, each user sees only their own data
- 📊 **Daily Limit** — 3 AI generations per user per day with usage bar
- 🗑️ **Delete Plans** — Remove past itineraries from history
- 🔗 **Share Link** — Every itinerary has a unique shareable URL
- 📄 **Export PDF** — Download a branded PDF of any itinerary
- 💾 **MongoDB Storage** — All itineraries saved and retrievable

---

## 🛠️ Tech Stack

| Layer    | Tech                              |
|----------|-----------------------------------|
| Frontend | React + Vite + React Router       |
| Backend  | Node.js + Express                 |
| Database | MongoDB + Mongoose                |
| AI       | OpenAI GPT-4o-mini                |
| Auth     | JWT + bcryptjs                    |
| PDF      | jsPDF (client-side)               |
| Deploy   | Vercel (client) + Render (server) |

---

## 🚀 Run Locally

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- [OpenAI API key](https://platform.openai.com/api-keys)

### Backend
```bash
cd server
cp .env.example .env      # fill in your keys
npm install
npm run dev               # http://localhost:8000
```

### Frontend
```bash
cd client
npm install
npm run dev               # http://localhost:5173
```

---

## ⚙️ Environment Variables

### `server/.env`
```
PORT=8000
MONGO_URI=your_mongodb_uri
OPENAI_API_KEY=your_openai_key
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
DAILY_LIMIT=3
```

### `client/.env`
```
VITE_API_URL=http://localhost:8000/api
```

---

## 📁 Project Structure

```
Travel-Itinerary/
├── server/
│   ├── config/db.js
│   ├── middleware/auth.middleware.js
│   ├── models/
│   │   ├── User.model.js
│   │   └── Itinerary.model.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── itinerary.controller.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── itinerary.routes.js
│   └── index.js
└── client/
    └── src/
        ├── api/itinerary.js
        ├── context/AuthContext.jsx
        └── pages/
            ├── Auth.jsx
            ├── Home.jsx
            ├── Result.jsx
            └── History.jsx
```

---

## 🌐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login |
| GET | `/api/auth/me` | ✅ | Get current user |
| POST | `/api/itineraries/generate` | ✅ | Generate + save itinerary |
| GET | `/api/itineraries` | ✅ | List user's itineraries |
| GET | `/api/itineraries/usage` | ✅ | Today's usage stats |
| GET | `/api/itineraries/:id` | ✅ | Get one itinerary |
| DELETE | `/api/itineraries/:id` | ✅ | Delete itinerary |
| GET | `/api/health` | ❌ | Health check |

---

## 🏰 About

Built to demonstrate the core feature of [MysTrip](https://mystrip.in) — a Jaipur-based startup building AI-powered travel experiences for Rajasthan. This project was developed to understand their MERN + AI stack and showcase product thinking.
