from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.analysis import Analysis
from app.models.entry import Entry
from app.models.user import User
from app.schemas.entry import EntryCreateRequest, EntryResponse
from app.workers.tasks import process_entry_analysis

router = APIRouter()


@router.post("", response_model=EntryResponse)
def create_entry(payload: EntryCreateRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> Entry:
    if not payload.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    entry = Entry(user_id=user.id, text=payload.text.strip())
    db.add(entry)
    db.flush()
    db.add(Analysis(entry_id=entry.id, status="pending"))
    db.commit()
    db.refresh(entry)

    process_entry_analysis.delay(entry.id)
    return entry


@router.get("", response_model=list[EntryResponse])
def list_entries(db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> list[Entry]:
    return db.execute(
        select(Entry).options(selectinload(Entry.analyses)).where(Entry.user_id == user.id).order_by(Entry.created_at.desc())
    ).scalars().all()


@router.get("/{entry_id}", response_model=EntryResponse)
def get_entry(entry_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> Entry:
    entry = db.execute(
        select(Entry).options(selectinload(Entry.analyses)).where(Entry.id == entry_id, Entry.user_id == user.id)
    ).scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return entry
