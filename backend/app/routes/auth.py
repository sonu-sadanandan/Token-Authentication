from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
import jwt

from app.schemas import UserSchema
from app.database import users_collection
from app.config import SECRET_KEY, ALGORITHM
from app.helpers.auth import (
    hash_password, 
    verify_password, 
    create_access_token,
    create_refresh_token
)

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

#routes

@router.get("/test")
async def test():
    return {"message": "Hello, World!"}

@router.post("/signup")
async def signup(user: UserSchema):
    existing_user = await users_collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")
    
    hashed_pass = hash_password(user.password)
    new_user = {"username": user.username, "password": hashed_pass}
    await users_collection.insert_one(new_user)
    return {"message": "User created successfully"}

@router.post("/login")
async def login(user: UserSchema):
    db_user = await users_collection.find_one({"username": user.username})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
    
    access_token = create_access_token(data = {"sub":user.username})
    refresh_token = create_refresh_token(data={"sub":user.username})
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

@router.post("/refresh")
async def refresh_token(refresh_token: str):
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])

        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="invalid token, no username found")
        
        new_access_token = create_access_token(data={"sub": username})
        new_refresh_token = create_refresh_token(data={"sub": username})
        return {"access_token": new_access_token, "refresh_token": new_refresh_token, "token_type": "bearer"}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="could not validate token")


@router.get("/protected")
async def protected_route(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms = [ALGORITHM])

        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail = "Access token expired")
        
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="invalid token")
        return {"message": f"Hello {username}, you have access to this protected route!"}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Access token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")