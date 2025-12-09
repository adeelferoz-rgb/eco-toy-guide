from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
from app.core.config import get_settings
from app.api import auth
from app.api import certifications
from app.api import toys
from app.api import users

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to MongoDB
    app.mongodb_client = AsyncIOMotorClient(settings.MONGODB_URI)
    app.database = app.mongodb_client[settings.DATABASE_NAME]
    print("Connected to MongoDB")
    yield
    # Shutdown: Close connection
    app.mongodb_client.close()
    print("Disconnected from MongoDB")

app = FastAPI(title=settings.APP_NAME, lifespan=lifespan)

# CORS Configuration
origins = settings.CORS_ORIGINS.split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(certifications.router, prefix="/api/v1/certifications", tags=["certifications"])
app.include_router(toys.router, prefix="/api/v1/toys", tags=["toys"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])

@app.get("/api/v1/healthz")
async def health_check():
    try:
        # Ping the database to ensure connection
        await app.mongodb_client.admin.command('ping')
        return {"status": "ok", "db": "connected"}
    except Exception as e:
        return {"status": "error", "db": "disconnected", "details": str(e)}