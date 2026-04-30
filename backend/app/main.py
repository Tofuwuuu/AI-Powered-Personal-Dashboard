from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth, entries, insights

app = FastAPI(title="AI Personal Dashboard API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(entries.router, prefix="/entries", tags=["entries"])
app.include_router(insights.router, prefix="/insights", tags=["insights"])


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
