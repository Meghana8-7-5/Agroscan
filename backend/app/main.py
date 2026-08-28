"""AgroScan FastAPI application entry point."""

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.routers import health

settings = get_settings()


@asynccontextmanager
async def lifespan(_app: FastAPI):
    settings.upload_path.mkdir(parents=True, exist_ok=True)
    yield


app = FastAPI(
    title="AgroScan API",
    description="AI-powered crop disease detection and advisory platform",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)


@app.get("/", tags=["root"])
def root():
    return {
        "name": "AgroScan API",
        "docs": "/docs",
        "health": "/health",
    }
