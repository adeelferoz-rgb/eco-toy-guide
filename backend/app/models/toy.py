from pydantic import BaseModel, Field, BeforeValidator
from typing import Optional, List, Annotated
from datetime import datetime
from bson import ObjectId

# Helper for ObjectId handling
PyObjectId = Annotated[str, BeforeValidator(str)]

class ToyBase(BaseModel):
    name: str
    description: str
    brand: str
    price: float
    currency: str = "USD"
    buy_link: str
    materials: List[str]
    age_range: str
    category: str
    image_url: str = "/placeholder.svg"
    certification_ids: Optional[List[str]] = []

class ToyInDB(ToyBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class ToyResponse(ToyBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    created_at: datetime
    match_score: Optional[int] = None
    match_reason: Optional[str] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}