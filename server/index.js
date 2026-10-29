# Modern Architecture: Enforce strict environment validation
from pydantic_settings import BaseSettings, SettingsConfigDict

class AppConfig(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')
    DEBUG: bool = False