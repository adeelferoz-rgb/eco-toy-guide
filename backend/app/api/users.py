from fastapi import APIRouter, Depends, HTTPException, status, Request
from typing import List
from bson import ObjectId
from app.api.deps import get_current_user
from app.models.user import UserResponse, UserUpdate
from app.models.toy import ToyResponse

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def read_users_me(
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Get current user profile.
    """
    return current_user

@router.patch("/me", response_model=UserResponse)
async def update_user_me(
    user_update: UserUpdate,
    request: Request,
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Update current user profile.
    """
    db = request.app.database
    
    update_data = user_update.model_dump(exclude_unset=True)
    
    if update_data:
        await db["users"].update_one(
            {"_id": ObjectId(current_user.id)},
            {"$set": update_data}
        )
        
        # Fetch updated user
        updated_user = await db["users"].find_one({"_id": ObjectId(current_user.id)})
        return UserResponse(**updated_user)
    
    return current_user

@router.post("/me/saved-toys/{toy_id}", response_model=UserResponse)
async def save_toy(
    toy_id: str,
    request: Request,
    current_user: UserResponse = Depends(get_current_user)
):
    db = request.app.database
    
    # Check if toy exists
    if not await db["toys"].find_one({"_id": ObjectId(toy_id)}):
        raise HTTPException(status_code=404, detail="Toy not found")
        
    # Check if already saved
    if toy_id in current_user.saved_toy_ids:
        return current_user
        
    # Add to saved toys
    await db["users"].update_one(
        {"_id": ObjectId(current_user.id)},
        {"$addToSet": {"saved_toy_ids": toy_id}}
    )
    
    # Fetch updated user
    updated_user = await db["users"].find_one({"_id": ObjectId(current_user.id)})
    return UserResponse(**updated_user)

@router.delete("/me/saved-toys/{toy_id}", response_model=UserResponse)
async def unsave_toy(
    toy_id: str,
    request: Request,
    current_user: UserResponse = Depends(get_current_user)
):
    db = request.app.database
    
    # Remove from saved toys
    await db["users"].update_one(
        {"_id": ObjectId(current_user.id)},
        {"$pull": {"saved_toy_ids": toy_id}}
    )
    
    # Fetch updated user
    updated_user = await db["users"].find_one({"_id": ObjectId(current_user.id)})
    return UserResponse(**updated_user)

@router.get("/me/saved-toys", response_model=List[ToyResponse])
async def get_saved_toys(
    request: Request,
    current_user: UserResponse = Depends(get_current_user)
):
    db = request.app.database
    
    if not current_user.saved_toy_ids:
        return []
        
    # Convert string IDs to ObjectIds
    toy_object_ids = [ObjectId(tid) for tid in current_user.saved_toy_ids]
    
    cursor = db["toys"].find({"_id": {"$in": toy_object_ids}})
    toys = await cursor.to_list(length=100)
    
    return [ToyResponse(**toy) for toy in toys]