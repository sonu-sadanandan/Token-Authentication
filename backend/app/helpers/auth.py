import bcrypt
import jwt
from datetime import datetime, timedelta, timezone
from app.config import SECRET_KEY, ALGORITHM

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    # Note: replaced datetime.now() with UTC timezone aware datetime (best practice)
    expire = datetime.now(timezone.utc) + timedelta(minutes=3)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)