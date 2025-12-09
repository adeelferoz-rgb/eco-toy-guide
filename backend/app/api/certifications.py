from fastapi import APIRouter, Request, HTTPException
from typing import List
from app.models.certification import CertificationResponse
from app.core.config import get_settings

router = APIRouter()
settings = get_settings()

@router.get("/", response_model=List[CertificationResponse])
async def get_certifications(request: Request):
    """
    Retrieve all certifications.
    """
    try:
        collection = request.app.database.certifications
        certifications = await collection.find().to_list(length=None)
        return certifications
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")