from datetime import datetime

from pydantic import BaseModel

from app.schemas.analysis import AnalysisResponse


class EntryCreateRequest(BaseModel):
    text: str


class EntryResponse(BaseModel):
    id: int
    text: str
    created_at: datetime
    analyses: list[AnalysisResponse] = []

    class Config:
        from_attributes = True
