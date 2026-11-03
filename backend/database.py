"""
Scan2SQL — PostgreSQL Database Connection & Session Management
Uses SQLAlchemy 2.0 ORM with connection pooling and health diagnostics.
"""
import logging
from typing import Generator, Dict, Any
from sqlalchemy import create_engine, text, inspect
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from sqlalchemy.exc import SQLAlchemyError

from backend.config import settings

logger = logging.getLogger("scan2sql.database")

# Normalize connection string if user provided 'postgresql://' instead of 'postgresql+psycopg2://'
database_url = settings.DATABASE_URL
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql+psycopg2://", 1)
elif database_url.startswith("postgresql://") and "+psycopg2" not in database_url:
    database_url = database_url.replace("postgresql://", "postgresql+psycopg2://", 1)

# Create SQLAlchemy Engine with pre-ping to handle dropped connections gracefully
engine = create_engine(
    database_url,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
    echo=False,
)

# Session factory for FastAPI request dependency injection
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative Base for ORM models
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that yields a SQLAlchemy database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> Dict[str, Any]:
    """
    Create all normalized PostgreSQL tables defined in backend.models if they do not exist.
    Returns connection and table creation status so the application can report clear diagnostics.
    """
    # Import models inside init_db to ensure they are registered on Base.metadata
    from backend import models  # noqa: F401

    try:
        Base.metadata.create_all(bind=engine)
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        logger.info("PostgreSQL database initialized successfully. Active tables: %s", tables)
        return {
            "connected": True,
            "tables": tables,
            "error": None,
        }
    except SQLAlchemyError as exc:
        logger.error("Failed to connect or initialize PostgreSQL database: %s", exc)
        return {
            "connected": False,
            "tables": [],
            "error": str(exc),
        }


def check_database_connection() -> Dict[str, Any]:
    """
    Execute a live connectivity check against PostgreSQL and inspect table counts.
    """
    try:
        with engine.connect() as connection:
            version_row = connection.execute(text("SELECT version();")).fetchone()
            db_name_row = connection.execute(text("SELECT current_database();")).fetchone()

            inspector = inspect(engine)
            existing_tables = inspector.get_table_names()

            counts: Dict[str, int] = {}
            for table_name in ("documents", "bills", "bill_items"):
                if table_name in existing_tables:
                    row = connection.execute(
                        text(f"SELECT COUNT(*) FROM {table_name};")
                    ).fetchone()
                    counts[table_name] = int(row[0]) if row else 0
                else:
                    counts[table_name] = 0

            return {
                "connected": True,
                "database_name": db_name_row[0] if db_name_row else "scan2sql_db",
                "server_version": version_row[0] if version_row else "PostgreSQL",
                "tables_detected": existing_tables,
                "record_counts": counts,
                "error": None,
            }
    except Exception as exc:
        return {
            "connected": False,
            "database_name": None,
            "server_version": None,
            "tables_detected": [],
            "record_counts": {"documents": 0, "bills": 0, "bill_items": 0},
            "error": str(exc),
        }
