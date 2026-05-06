import os

from dotenv import load_dotenv
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str = "postgresql://postgres:postgres@localhost:5432/dashboard"
    redis_url: str = "redis://localhost:6379/0"

    jwt_secret_key: str = "change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_minutes: int = 10080

    ai_provider: str = Field(default_factory=lambda: os.getenv("AI_PROVIDER", "google"))
    google_api_key: str = Field(default_factory=lambda: os.getenv("GOOGLE_API_KEY", ""))
    google_model: str = Field(default_factory=lambda: os.getenv("GOOGLE_MODEL", "gemini-2.0-flash"))
    google_fallback_model: str = Field(default_factory=lambda: os.getenv("GOOGLE_FALLBACK_MODEL", "gemini-2.0-flash-lite"))


settings = Settings()
