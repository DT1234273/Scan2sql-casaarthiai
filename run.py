"""
Scan2SQL — Local Windows Startup Script
Run with: python run.py
"""
import os
import sys
from pathlib import Path
import uvicorn
from dotenv import load_dotenv


def ensure_directories() -> None:
    """Ensure local upload and export directories exist before starting."""
    base_dir = Path(__file__).resolve().parent
    load_dotenv(base_dir / ".env")

    upload_dir = base_dir / os.getenv("UPLOAD_DIR", "uploads")
    export_dir = base_dir / os.getenv("EXPORT_DIR", "exports")

    upload_dir.mkdir(parents=True, exist_ok=True)
    export_dir.mkdir(parents=True, exist_ok=True)


def main() -> None:
    ensure_directories()
    host = os.getenv("APP_HOST", "127.0.0.1")
    port = int(os.getenv("APP_PORT", "8000"))
    debug = os.getenv("DEBUG", "True").lower() in ("true", "1", "yes")

    print("=" * 68)
    print("  Scan2SQL — Intelligent Document Scanner & SQL Extraction System")
    print("  Phase 1: Project Setup & PostgreSQL Database Architecture")
    print("=" * 68)
    print(f"  Server URL     : http://{host}:{port}")
    print(f"  Swagger UI Docs: http://{host}:{port}/docs")
    print(f"  Health Check   : http://{host}:{port}/api/health")
    print("=" * 68)

    uvicorn.run(
        "backend.main:app",
        host=host,
        port=port,
        reload=debug,
    )


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nScan2SQL server stopped.")
        sys.exit(0)
