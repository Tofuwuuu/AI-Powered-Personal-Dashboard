from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import tasks, ai
from .settings import settings

app = FastAPI(title="AI-Powered Personal Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/health")
def health():
    return {"status": "ok"}

app.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
app.include_router(ai.router, prefix="/ai", tags=["ai"])


