from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import JSONB

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.analysis import Analysis
from app.models.entry import Entry
from app.models.user import User

router = APIRouter()


@router.get("/overview")
def overview(from_date: datetime | None = None, to_date: datetime | None = None, db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> dict:
    filters = [Entry.user_id == user.id, Analysis.status == "completed"]
    if from_date:
        filters.append(Entry.created_at >= from_date)
    if to_date:
        filters.append(Entry.created_at <= to_date)

    sentiments = db.execute(
        select(Analysis.sentiment, func.count(Analysis.id))
        .join(Entry, Entry.id == Analysis.entry_id)
        .where(*filters)
        .group_by(Analysis.sentiment)
    ).all()

    classes = db.execute(
        select(Analysis.classification, func.count(Analysis.id))
        .join(Entry, Entry.id == Analysis.entry_id)
        .where(*filters)
        .group_by(Analysis.classification)
        .order_by(func.count(Analysis.id).desc())
        .limit(5)
    ).all()

    topics = db.execute(
        select(func.jsonb_array_elements_text(func.cast(Analysis.key_topics, JSONB)).label("topic"), func.count(Analysis.id).label("count"))
        .join(Entry, Entry.id == Analysis.entry_id)
        .where(*filters, Analysis.key_topics.is_not(None))
        .group_by("topic")
        .order_by(func.count(Analysis.id).desc())
        .limit(10)
    ).all()

    return {
        "sentiment_distribution": {k or "unknown": v for k, v in sentiments},
        "top_classifications": [{"classification": c or "unknown", "count": n} for c, n in classes],
        "top_topics": [{"topic": t, "count": n} for t, n in topics],
    }


@router.get("/trends")
def trends(db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> dict:
    rows = db.execute(
        select(func.date(Entry.created_at).label("day"), func.avg(Analysis.confidence))
        .join(Entry, Entry.id == Analysis.entry_id)
        .where(Entry.user_id == user.id, Analysis.status == "completed")
        .group_by(func.date(Entry.created_at))
        .order_by(func.date(Entry.created_at))
    ).all()
    return {"confidence_trend": [{"day": str(day), "avg_confidence": float(avg or 0.0)} for day, avg in rows]}
