"""
FastAPI main application for DevForge AI Platform
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.api import routes, chat
from app.codeforge import routes as codeforge_routes

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="DevForge AI API",
    description="Production-ready API for intelligent development tools including Smart Path Finder and CodeForge",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(routes.router, prefix="/api", tags=["routes"])
app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(codeforge_routes.router, prefix="/api/codeforge", tags=["codeforge"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "DevForge AI API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/health"
    }


@app.on_event("startup")
async def startup_event():
    """Startup event handler"""
    logger.info("🚀 DevForge AI API starting up...")
    logger.info("📍 API Documentation: http://localhost:8000/docs")
    logger.info("🔧 Health Check: http://localhost:8000/api/health")


@app.on_event("shutdown")
async def shutdown_event():
    """Shutdown event handler"""
    logger.info("👋 DevForge AI API shutting down...")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

