from app.core.config import settings
from app.services.ai.base import AIProvider
from app.services.ai.openai_provider import OpenAIProvider


def get_ai_provider() -> AIProvider:
    if settings.ai_provider == "openai":
        return OpenAIProvider()
    raise ValueError(f"Unsupported provider: {settings.ai_provider}")
