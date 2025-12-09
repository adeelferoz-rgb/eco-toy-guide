from typing import Annotated, Optional
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from app.core.config import get_settings
from app.models.user import UserResponse
from bson import ObjectId

settings = get_settings()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], request: Request) -> UserResponse:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except (JWTError, ValidationError):
        raise credentials_exception
    
    db = request.app.database
    try:
        user = await db["users"].find_one({"_id": ObjectId(user_id)})
    except Exception:
        raise credentials_exception

    if user is None:
        raise credentials_exception
    return UserResponse(**user)
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login", auto_error=False)

async def get_current_user_optional(
    request: Request,
    token: Annotated[Optional[str], Depends(oauth2_scheme_optional)] = None
) -> Optional[UserResponse]:
    if not token:
        return None
        
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
    except (JWTError, ValidationError):
        return None
    
    db = request.app.database
    try:
        user = await db["users"].find_one({"_id": ObjectId(user_id)})
    except Exception:
        return None

    if user is None:
        return None
        
    return UserResponse(**user)