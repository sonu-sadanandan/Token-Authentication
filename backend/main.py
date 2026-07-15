from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
import bcrypt
import jwt
from datetime import datetime, timedelta

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)  

MONGO_DETAILS = "mongodb://localhost:27017"
SECRET_KEY = "MY SECRET KEY"
ALGORITHM = "HS256"

client = AsyncIOMotorClient(MONGO_DETAILS)
db = client.auth_db
users_collection = db.get_collection("users")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

class UserSchema(BaseModel):
    username: str
    password: str


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

#routes

@app.post("signup")
async def signup(user: UserSchema):
    existing_user = await users_collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")
    
    hashed_pass = hash_password(user.password)
    new_user = {"username": user.username, "password": hashed_pass}
    await users_collection.insert_one(new_user)
    return {"message": "User created successfully"}

@app.post("/login")
async def login(user: UserSchema):
    db_user = await users_collection.find_one({"username": user.username})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
    
    token = create_access_token(data = {"sub":user.username})
    return {"access_token": token, "token_type": "bearer"}

