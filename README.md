# VoiceBridge AI — Full-Stack Multilingual Voice Assistant

[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg)](https://www.mongodb.com/atlas)
[![Gemini AI](https://img.shields.io/badge/Google-Gemini%20AI-orange.svg)](https://ai.google.dev/)

**VoiceBridge AI** is an AI-powered multilingual voice assistant created to bridge the language gap between students, communities, and educational or public institutions. Users can speak or type inquiries in **English**, **Telugu (తెలుగు)**, or **Hindi (हिन्दी)**, receive context-aware answers powered by Google Gemini, and hear responses read aloud via natural Text-to-Speech (TTS).

---

## 🌟 Key Features

1. **Multilingual Conversational AI**:
   - Native support for **English**, **Telugu (తెలుగు)**, and **Hindi (हिन्दी)**.
   - Context-preserving chat history for intuitive follow-up questions.
   - Transparent error handling (never invents fake AI responses if an API key is unconfigured).

2. **Hands-Free Speech-to-Text (STT)**:
   - Web Speech API integration with continuous speech capture.
   - Real-time interim transcript preview allowing live editing before sending.
   - Dynamic animated audio wave visualizer and microphone status pill.

3. **Natural Text-to-Speech (TTS)**:
   - Browser SpeechSynthesis API matching native voices for English, Telugu, and Hindi.
   - Play, stop, and pause controls for every assistant response.
   - Configurable auto-read mode in Settings.

4. **Robust Authentication & Security**:
   - JWT authentication with secure HTTP Bearer token management.
   - Strong password hashing using `bcryptjs`.
   - Zod schema validation on all incoming request bodies.
   - Centralized error handling and rate-limiting (120 req/15 min).
   - Strict resource ownership checks preventing cross-user conversation access.

5. **Real Application Analytics & Persistence**:
   - MongoDB database models with compound indexing.
   - User statistics (total sessions, message count, active language).
   - Conversation history with search filtering and deletion controls.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router 6, Tailwind CSS, Axios, Lucide Icons |
| **Backend** | Node.js, Express.js, JWT (`jsonwebtoken`), `bcryptjs`, `zod`, `cors`, `express-rate-limit` |
| **Database** | MongoDB Atlas with Mongoose ODM (with seamless in-memory fallback for immediate zero-config testing) |
| **AI & Voice** | Google Gemini SDK (`@google/generative-ai`), Web Speech API (STT), SpeechSynthesis (TTS) |
| **Deployment** | Vercel (Frontend), Render (Backend), MongoDB Atlas (Database) |

---

## 📁 Repository Structure

```
voicebridge-ai/
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI (LanguageSelector, AudioVisualizer, ChatMessage, etc.)
│   │   ├── context/            # AuthContext (persistent sessions, login, register, logout)
│   │   ├── hooks/              # useSpeechRecognition (STT), useSpeechSynthesis (TTS)
│   │   ├── layouts/            # DashboardLayout (Sidebar, Mobile menu, Header)
│   │   ├── pages/              # 7 Full Pages (Landing, Register, Login, Dashboard, Chat, History, Settings)
│   │   ├── services/           # api.js (Axios with Bearer interceptors)
│   │   ├── App.jsx             # React Router routing
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vercel.json             # Vercel SPA routing
│   └── .env.example
├── backend/
│   ├── src/
│   │   ├── config/             # env.js (Zod validator), db.js (Mongoose connection)
│   │   ├── controllers/        # auth, conversation, settings, chat controllers
│   │   ├── middleware/         # authMiddleware, validateMiddleware, errorMiddleware
│   │   ├── models/             # User.js, Conversation.js
│   │   ├── routes/             # authRoutes, conversationRoutes, settingsRoutes, chatRoutes
│   │   ├── services/           # aiService.js (Gemini), memoryStore.js (local fallback)
│   │   ├── tests/              # Automated unit and E2E test suites
│   │   └── validators/         # Zod schemas for auth, chat, settings
│   ├── server.js               # Express application entrypoint
│   └── .env.example
├── package.json                # Root monorepo scripts
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone <repo-url>
cd "voice bridge - AI"

# Install all root, frontend, and backend packages
npm run install:all
```

*(Alternatively, run `npm install` in both `/frontend` and `/backend`)*

---

### 2. Configure Environment Variables

#### Backend Configuration:
Create `backend/.env` (or copy from `backend/.env.example`):

```ini
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB Connection String (Atlas or Local)
# If left as default and no local Mongo daemon is active, an in-memory instance starts automatically!
MONGODB_URI=mongodb://127.0.0.1:27017/voicebridge

# JWT Authentication Secret Key
JWT_SECRET=voicebridge_hackathon_super_secret_jwt_key_2025_secure

# Google Gemini API Key
# Obtain a free key from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here
```

#### Frontend Configuration:
Create `frontend/.env` (or copy from `frontend/.env.example`):

```ini
VITE_API_BASE_URL=http://localhost:5000/api
```

---

### 3. Run Development Servers

From the root directory:

```bash
# Runs backend on http://localhost:5000 and frontend on http://localhost:5173 concurrently
npm run dev
```

Or run separately:
```bash
# Run backend
npm run dev:backend

# Run frontend
npm run dev:frontend
```

Open your browser at **`http://localhost:5173`**.

---

## 🧪 Testing

The backend includes automated test suites covering input validation, security rules, and end-to-end API workflows:

```bash
# Run unit tests
npm run test --prefix backend

# Run end-to-end workflow verification (requires backend running)
node backend/src/tests/e2e.test.js
```

**Test Suite Coverage:**
- `✔ Auth Validators (name, email format, password strength)`
- `✔ Chat Validators (message length, language tags, history)`
- `✔ Settings Validators (language codes, boolean playback preferences)`
- `✔ Health check (/api/health)`
- `✔ Registration with JWT token issuance`
- `✔ Demo account authentication`
- `✔ Authenticated session recovery (/api/auth/me)`
- `✔ Conversation creation, retrieval, and ownership checks`
- `✔ User settings persistence`
- `✔ Transparent 503 error handling when GEMINI_API_KEY is not configured`
- `✔ Conversation deletion`

---

## 📖 API Documentation

All protected routes require an `Authorization: Bearer <token>` header.

### Authentication
- `POST /api/auth/register` — Register a new account (`{ name, email, password, preferredLanguage }`).
- `POST /api/auth/login` — Login (`{ email, password }`).
- `GET /api/auth/me` — Retrieve current authenticated profile.

### AI Voice Assistant
- `POST /api/chat` — Send a query to the AI (`{ message, language, conversationId, history }`).
  - Response: `{ success: true, reply: "...", conversationId: "...", title: "..." }`

### Conversations
- `GET /api/conversations` — List current user's conversations.
- `POST /api/conversations` — Create a new conversation (`{ title, initialMessage }`).
- `GET /api/conversations/:id` — Get conversation details and message timeline (with ownership verification).
- `DELETE /api/conversations/:id` — Delete conversation (with ownership verification).

### Settings
- `GET /api/settings` — Get user language and TTS preferences.
- `PATCH /api/settings` — Update preferences (`{ preferredLanguage, autoPlaySpeech }`).

### System Health
- `GET /api/health` — Check server status, uptime, database connection state, and AI configuration.

---

## ☁️ Deployment Guide

### 1. Database: MongoDB Atlas
1. Create a free M0 cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Under **Network Access**, add `0.0.0.0/0` (Allow Access from Anywhere) to permit connections from Render.
3. Under **Database Access**, create a database user and password.
4. Click **Connect** -> **Connect your application** -> Copy the connection string:
   `mongodb+srv://<username>:<password>@cluster0.mongodb.net/voicebridge?retryWrites=true&w=majority`

### 2. Backend: Render
1. Create a new **Web Service** on [render.com](https://render.com).
2. Connect your GitHub repository.
3. Set **Root Directory** to `backend`.
4. Set **Build Command** to `npm install`.
5. Set **Start Command** to `npm start`.
6. Add Environment Variables:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `<Your MongoDB Atlas connection URI>`
   - `JWT_SECRET`: `<A strong random 32+ character string>`
   - `GEMINI_API_KEY`: `<Your Google Gemini API Key>`
   - `CLIENT_URL`: `https://<your-vercel-app-name>.vercel.app`

### 3. Frontend: Vercel
1. Import your repository into [vercel.com](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Framework Preset: **Vite**.
4. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://<your-render-service>.onrender.com/api`
5. Deploy! Vercel uses `vercel.json` for client-side single-page routing automatically.

---

## 🎯 Demo & Evaluation Walkthrough

For hackathon judges and evaluators:
1. Open the web app at `http://localhost:5173`.
2. Click **Sign In**.
3. Click the convenient **"Fill Demo Credentials"** button to automatically populate:
   - Email: `student@voicebridge.ai`
   - Password: `DemoPass123!`
4. Click **Sign In** to navigate to the Dashboard.
5. In the Dashboard, review real statistics (total conversations, message counts, active language).
6. Click **"Start New Voice Chat"**.
7. In the chat interface:
   - Switch language to **Telugu (తెలుగు)** or **Hindi (हिन्दी)** using the selector.
   - Click the **Microphone** button and speak your query, or click one of the suggested query chips.
   - Click **Send**.
   - Click the **"Listen"** button on the assistant's response to hear it read aloud with SpeechSynthesis!
8. Navigate to **History** to review the saved chat session and search previous inquiries.
9. Navigate to **Settings** to toggle **Auto-play Speech Responses** or update your default language.
