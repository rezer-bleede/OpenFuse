"""Database session management for OpenFuse."""

from sqlmodel import Session, SQLModel, create_engine
from typing import Generator

from app.core.config import settings

engine = create_engine(settings.database_url, echo=False, pool_pre_ping=True)


def create_db_and_tables() -> None:
    """Create all database tables."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """Get database session."""
    with Session(engine) as session:
        yield session
