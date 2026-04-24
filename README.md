# AI-Powered Personal Dashboard

Full-stack personal dashboard built with React + TypeScript, FastAPI, PostgreSQL, Redis, and Celery.

## Features
- JWT authentication (register/login/refresh/me)
- Text entry submission and async AI analysis pipeline
- JSON-schema-enforced AI outputs (summary, classification, sentiment, topics, action items, confidence)
- Aggregated insights and trend endpoints
- Data-driven dashboard UI with live polling

## Quick start
1. Copy `.env.example` to `.env` and fill values.
2. Run `docker compose up --build`.
3. Run migrations: `docker compose exec api alembic upgrade head`.
4. Open frontend at http://localhost:5173 and API docs at http://localhost:8000/docs.
