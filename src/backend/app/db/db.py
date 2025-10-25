from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DB = os.getenv("MONGODB_DB", "dnd_dev")

client = MongoClient(MONGODB_URI)
db = client[MONGODB_DB]

print(f"Connected to MongoDB database: {MONGODB_DB}")
