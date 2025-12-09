from pydantic import BaseModel, Field, BeforeValidator
from typing import Optional, Annotated
from bson import ObjectId

# Helper for ObjectId handling
PyObjectId = Annotated[str, BeforeValidator(str)]

class CertificationBase(BaseModel):
    slug: str
    name: str
    logo: str
    description: str
    meaning: str
    impact: str

class CertificationInDB(CertificationBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class CertificationResponse(CertificationBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}