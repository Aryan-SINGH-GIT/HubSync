# HubSync

A modern full-stack web application for managing clients, talents, gigs, and notes, featuring AI-powered note summarization and a beautiful, responsive UI.

## 🚀 Live Demo

- **Frontend:** [https://hubsync-1.onrender.com/](https://hubsync-1.onrender.com/)
- **Backend API:** [https://hubsync.onrender.com](https://hubsync.onrender.com)

*(Replace the frontend link above with your actual deployed frontend URL!)*

---

## Features
- Responsive React + Vite frontend
- Bootstrap UI with sidebar, modals, and grid cards
- Full CRUD for Clients, Talents, Gigs, and Notes
- AI-powered note summarization (Hugging Face Inference API)
- Environment-based API URL for seamless local and production use
- Easy deployment to Render or Vercel

---

## Getting Started

### 1. Clone the repo
```sh
git clone https://github.com/Aryan-SINGH-GIT/HubSync.git
cd HubSync
```

### 2. Setup Backend
```sh
cd backend
npm install
# Create a .env file if needed for secrets
npm start
```

### 3. Setup Frontend
```sh
cd ../frontend
# Use Yarn for best compatibility
yarn install
# Create a .env file in the frontend root:
echo VITE_API_BASE_URL=https://hubsync.onrender.com > .env
# For local dev, use:
# VITE_API_BASE_URL=http://localhost:4000
# Start dev server
yarn dev
```

---

## Environment Variables

**Frontend (`frontend/.env`):**
```
VITE_API_BASE_URL=https://hubsync.onrender.com
```

**Backend (`backend/.env`):**
```
HF_API_TOKEN=your-huggingface-api-token
```

---

## Deployment

### Frontend (Render)
- **Root Directory:** `frontend`
- **Build Command:** `yarn install && yarn build`
- **Publish Directory:** `dist`
- **Environment Variable:** `VITE_API_BASE_URL=https://hubsync.onrender.com`

### Backend (Render)
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment Variable:** `HF_API_TOKEN=your-huggingface-api-token`


