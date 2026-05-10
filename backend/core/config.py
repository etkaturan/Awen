from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    groq_api_key: str = ""
    app_name: str = "Awen"
    debug: bool = True
    db_path: str = "awen.db"

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
