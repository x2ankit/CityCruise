# Deployment notes — CityCruise

This file contains quick deployment instructions for the Backend (recommended hosts) and Frontend (Vercel) and lists required environment variables.

## Backend (recommended hosts)

- Recommended: Render, Railway, Fly.io, or DigitalOcean App Platform
- Use the Dockerfile in `Backend/Dockerfile` (preferred) or set service root to `Backend` and run `npm install && npm start`.

Required environment variables (set in host dashboard):

- MONGO_URL — MongoDB connection string (Atlas or local)
- JWT_SECRET — Strong server-side secret (do NOT put this in frontend)
- GOOGLE_CLIENT_ID — Google OAuth client id
- FRONTEND_URL — frontend origin for CORS
- PORT — optional (host usually provides)

## Frontend (Vercel)

- Root directory: `Frontend`
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`
- Add these Environment Variables in Vercel project settings:
  - VITE_BASE_URL (your backend URL, e.g. https://api.example.com)
  - VITE_GOOGLE_CLIENT_ID

## Healthcheck

- A `GET /health` endpoint is available at the backend root that returns JSON with uptime and DB connection state. Use this for readiness/liveness checks.

## Security

- Do NOT put `.env` files or secrets in the repo. Set secrets in the host environment variables and keep them out of source control.
