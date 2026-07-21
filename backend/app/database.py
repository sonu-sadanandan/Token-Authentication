from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGO_DETAILS

client = AsyncIOMotorClient(MONGO_DETAILS)
db = client.auth_db
users_collection = db.get_collection("users")