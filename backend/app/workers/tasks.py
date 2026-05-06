import os

from celery import Celery
from sqlalchemy import select

from app.core.config import settings
from app.db.session import SessionLocal
from app.models.analysis import Analysis
from app.models.entry import Entry
from app.services.ai.factory import get_ai_provider

celery_app = Celery("dashboard_worker", broker=settings.redis_url, backend=settings.redis_url)


@celery_app.task(bind=True, max_retries=3)
def process_entry_analysis(self, entry_id: int) -> None:
    db = SessionLocal()
    try:
        if not (settings.google_api_key or os.getenv("GOOGLE_API_KEY", "")):
            raise ValueError("GOOGLE_API_KEY is not configured for worker environment.")

        entry = db.get(Entry, entry_id)
        if not entry:
            return

        analysis = db.execute(select(Analysis).where(Analysis.entry_id == entry_id).order_by(Analysis.id.desc())).scalar_one_or_none()
        if not analysis:
            analysis = Analysis(entry_id=entry_id, status="pending")
            db.add(analysis)
            db.flush()

        if analysis.status == "completed":
            db.commit()
            return

        analysis.status = "processing"
        db.commit()

        output = get_ai_provider().analyze_entry(entry.text)
        analysis.status = "completed"
        analysis.summary = output.summary
        analysis.classification = output.classification
        analysis.sentiment = output.sentiment
        analysis.key_topics = output.key_topics
        analysis.action_items = output.action_items
        analysis.confidence = output.confidence
        analysis.raw_output = output.model_dump()
        analysis.error = None
        db.commit()
    except Exception as exc:
        db.rollback()
        analysis = db.execute(select(Analysis).where(Analysis.entry_id == entry_id).order_by(Analysis.id.desc())).scalar_one_or_none()
        if analysis:
            analysis.status = "failed"
            analysis.error = str(exc)
            db.commit()
        raise self.retry(exc=exc, countdown=5)
    finally:
        db.close()
