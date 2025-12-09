from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    APP_NAME: str = "Eco Toy Guide API"
    APP_ENV: str = "development"
    MONGODB_URI: str
    DATABASE_NAME: str = "ecotoyguide"
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://localhost:5137"
    
    # Auth
    SECRET_KEY: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

@lru_cache
def get_settings():
    return Settings()