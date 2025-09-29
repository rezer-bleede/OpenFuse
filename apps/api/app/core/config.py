"""Application configuration using Pydantic settings."""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Base application settings."""

    version: str = "0.1.0"
    environment: str = "development"
    api_prefix: str = "/api"

    database_url: str = "postgresql+psycopg://openfuse:openfuse@postgres:5432/openfuse"
    redis_url: str = "redis://redis:6379/0"

    model_config = SettingsConfigDict(env_prefix="openfuse_", env_file=".env", extra="allow")


@lru_cache
def get_settings() -> Settings:
    """Cached settings instance."""

    return Settings()


settings = get_settings()
