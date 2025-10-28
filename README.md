# AI-Powered Personal Dashboard

Full-stack scaffold for a SmartLife-style dashboard: tasks, notes summarization, email digests, and AI chat. Built with React (Vite + TS), FastAPI, PostgreSQL, and OpenAI API.

## Stack
- Frontend: React + Vite + TypeScript
- Backend: FastAPI (Python 3.11)
- Database: PostgreSQL
- AI: OpenAI API (pluggable)
- Dev: docker-compose for Postgres, uvicorn for API, Vite dev server for web

## Getting Started

### Prerequisites
- Docker Desktop
- Node.js 18+
- Python 3.11+

### Setup
1. Copy env templates and fill values:
   - `.env` (root)
   - `backend/.env` (contains API keys and DB URL)
2. Start services:
   - `docker compose up -d` (Postgres)
   - Backend: `cd backend && python -m venv .venv && .\\.venv\\Scripts\\activate && pip install -r requirements.txt && uvicorn app.main:app --reload`
   - Frontend: `cd frontend && npm install && npm run dev`

### Environment
Root `.env`:
```
VITE_API_BASE=http://localhost:8000
```

Backend `backend/.env`:
```
OPENAI_API_KEY=sk-...
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/dashboard
ALLOWED_ORIGINS=http://localhost:5173
```

### Scripts
Backend helpful commands:
```
uvicorn app.main:app --reload
pytest -q
```

Frontend:
```
npm run dev
npm run build
```

## Features (MVP)
- Tasks CRUD
- AI chat (proxying OpenAI)
- Notes summarization endpoint
- Email summary placeholder

## Roadmap
- OAuth (Google) for email access
- User accounts & sessions
- Background jobs (Celery/RQ) for digests
- Vector search for notes

