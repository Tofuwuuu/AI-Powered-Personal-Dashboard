from app.core.config import settings
from app.services.ai.base import AIProvider
from app.services.ai.google_provider import GoogleProvider


def get_ai_provider() -> AIProvider:
    if settings.ai_provider == "google":
        return GoogleProvider()
    raise ValueError(f"Unsupported provider: {settings.ai_provider}")
