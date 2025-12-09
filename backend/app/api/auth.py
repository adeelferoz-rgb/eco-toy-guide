from fastapi import APIRouter, HTTPException, status, Request, Depends
from fastapi.responses import JSONResponse
from app.models.user import UserCreate, UserLogin, UserInDB, UserResponse, Token
from app.core.security import get_password_hash, verify_password, create_access_token
from datetime import datetime
from app.core.config import get_settings

router = APIRouter()
settings = get_settings()

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate, request: Request):
    db = request.app.database
    
    # Check if user already exists
    existing_user = await db["users"].find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    hashed_password = get_password_hash(user.password)
    
    # Create user object
    new_user = UserInDB(
        email=user.email,
        hashed_password=hashed_password,
        created_at=datetime.utcnow()
    )
    
    # Insert into DB
    user_dict = new_user.model_dump(by_alias=True, exclude={"id"})
    result = await db["users"].insert_one(user_dict)
    
    created_user = await db["users"].find_one({"_id": result.inserted_id})
    return UserResponse(**created_user)

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin, request: Request):
    db = request.app.database

    user = await db["users"].find_one({"email": user_credentials.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    if not verify_password(user_credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    access_token = create_access_token(subject=str(user["_id"]))
    
    return {"access_token": access_token, "token_type": "bearer"}