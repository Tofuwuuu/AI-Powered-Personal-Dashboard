from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))


class _Settings(BaseModel):
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+psycopg://postgres:postgres@localhost:5432/dashboard")
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")


settings = _Settings()


