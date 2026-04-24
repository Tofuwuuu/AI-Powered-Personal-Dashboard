from datetime import datetime

from pydantic import BaseModel, Field


class AnalysisStructuredOutput(BaseModel):
    summary: str = Field(min_length=1, max_length=600)
    classification: str = Field(min_length=1, max_length=100)
    sentiment: str = Field(pattern="^(positive|neutral|negative)$")
    key_topics: list[str] = Field(default_factory=list, max_length=10)
    action_items: list[str] = Field(default_factory=list, max_length=10)
    confidence: float = Field(ge=0.0, le=1.0)


class AnalysisResponse(BaseModel):
    id: int
    status: str
    summary: str | None
    classification: str | None
    sentiment: str | None
    key_topics: list[str] | None
    action_items: list[str] | None
    confidence: float | None
    error: str | None
    updated_at: datetime

    class Config:
        from_attributes = True
