import os
from dotenv import load_dotenv
load_dotenv()

class Config:
    MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    MONGODB_DB = os.getenv("MONGODB_DB", "dnd_dev")
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173")
