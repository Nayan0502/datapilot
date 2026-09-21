
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone

app = FastAPI(
    title="DataPilot API",
    description="Backend API for the DataPilot AI Data Intelligence Platform",
    version="1.0.0",
)

# Allow requests from the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Welcome to DataPilot API",
        "status": "running",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "datapilot-backend",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/api/datasets")
def get_datasets():
    return {
        "datasets": [],
        "message": "Dataset API is ready",
    }