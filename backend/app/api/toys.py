from fastapi import APIRouter, Request, HTTPException, Depends
from typing import List, Optional
from bson import ObjectId
from app.models.toy import ToyResponse, ToyInDB
from app.models.user import UserResponse
from app.api.deps import get_current_user_optional
from app.services.recommendation import calculate_match_score

router = APIRouter()

@router.get("/", response_model=List[ToyResponse])
async def read_toys(
    request: Request,
    age_range: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    recommend: Optional[bool] = False,
    current_user: Optional[UserResponse] = Depends(get_current_user_optional),
):
    """
    Retrieve all toys with optional filters and recommendation logic.
    """
    toys_collection = request.app.database.toys
    certifications_collection = request.app.database.certifications
    
    query = {}
    if age_range:
        query["age_range"] = age_range
    if category:
        query["category"] = category
    
    if min_price is not None or max_price is not None:
        price_query = {}
        if min_price is not None:
            price_query["$gte"] = min_price
        if max_price is not None:
            price_query["$lte"] = max_price
        query["price"] = price_query

    toys_data = await toys_collection.find(query).to_list(length=100)
    toys = [ToyResponse(**toy) for toy in toys_data]

    if recommend and current_user:
        # Fetch certifications for eco-match logic
        # Optimize by fetching only needed certs or all if list is small.
        # For now, fetching all is safe as cert list is small.
        cert_list = await certifications_collection.find().to_list(length=100)
        cert_map = {str(c["_id"]): c for c in cert_list}

        for toy in toys:
            score, reason = calculate_match_score(toy, current_user, cert_map)
            toy.match_score = score
            toy.match_reason = reason
        
        # Sort by score descending
        toys.sort(key=lambda x: x.match_score or 0, reverse=True)

    return toys

@router.get("/{toy_id}", response_model=ToyResponse)
async def read_toy(toy_id: str, request: Request):
    """
    Retrieve a specific toy by ID.
    """
    toys_collection = request.app.database.toys
    try:
        oid = ObjectId(toy_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid toy ID format")
        
    toy = await toys_collection.find_one({"_id": oid})
    if toy is None:
        raise HTTPException(status_code=404, detail="Toy not found")
    return toy