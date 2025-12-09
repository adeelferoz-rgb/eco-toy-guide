from pydantic import BaseModel, EmailStr, Field, BeforeValidator
from typing import Optional, List, Annotated
from datetime import datetime
from bson import ObjectId

# Helper for ObjectId handling
PyObjectId = Annotated[str, BeforeValidator(str)]

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(UserBase):
    password: str

class UserInDB(UserBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    saved_toy_ids: List[str] = []
    child_age_range: Optional[str] = None
    eco_goals: List[str] = []
    interests: List[str] = []

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserResponse(UserBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    created_at: datetime
    saved_toy_ids: List[str] = []
    child_age_range: Optional[str] = None
    eco_goals: List[str] = []
    interests: List[str] = []

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserUpdate(BaseModel):
    child_age_range: Optional[str] = None
    eco_goals: Optional[List[str]] = None
    interests: Optional[List[str]] = None

class Token(BaseModel):
    access_token: str
    token_type: str