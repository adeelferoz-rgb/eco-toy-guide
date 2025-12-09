import asyncio
import sys
import os

# Add the backend directory to sys.path to allow imports from app
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import get_settings

settings = get_settings()

certifications_data = [
    {
        "slug": "fsc",
        "name": "FSC (Forest Stewardship Council)",
        "logo": "/placeholder.svg",
        "description": "Ensures that products come from responsibly managed forests that provide environmental, social, and economic benefits.",
        "meaning": "The wood used in the toy is sourced sustainably, protecting forests for future generations.",
        "impact": "Promotes responsible forestry, conserves biodiversity, and respects the rights of indigenous peoples.",
    },
    {
        "slug": "gots",
        "name": "GOTS (Global Organic Textile Standard)",
        "logo": "/placeholder.svg",
        "description": "The worldwide leading textile processing standard for organic fibers, including ecological and social criteria.",
        "meaning": "For soft toys, this means the fabric is made from organic fibers and processed without harmful chemicals.",
        "impact": "Reduces the use of toxic pesticides and fertilizers, ensures safer working conditions, and produces a healthier final product.",
    },
    {
        "slug": "oeko-tex",
        "name": "OEKO-TEX Standard 100",
        "logo": "/placeholder.svg",
        "description": "A worldwide consistent, independent testing and certification system for raw, semi-finished, and finished textile products.",
        "meaning": "Every component of the toy has been tested for harmful substances and is harmless for human health.",
        "impact": "Protects consumers from harmful chemicals in textiles, ensuring toys are safe to touch and play with.",
    },
    {
        "slug": "green-seal",
        "name": "Green Seal",
        "logo": "/placeholder.svg",
        "description": "A non-profit organization that develops life-cycle-based sustainability standards for products, services, and companies.",
        "meaning": "The toy meets rigorous standards for performance, health, and environmental safety.",
        "impact": "Signifies a product has a reduced environmental impact from manufacturing to disposal.",
    },
]

async def seed_certifications():
    print(f"Connecting to MongoDB at {settings.MONGODB_URI}...")
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.DATABASE_NAME]
    collection = db.certifications

    print("Seeding certifications...")
    
    # Clear existing certifications to avoid duplicates or stale data
    await collection.delete_many({})
    print("Cleared existing certifications.")

    result = await collection.insert_many(certifications_data)
    print(f"Inserted {len(result.inserted_ids)} certifications.")

    client.close()
    print("Seeding complete.")

if __name__ == "__main__":
    asyncio.run(seed_certifications())