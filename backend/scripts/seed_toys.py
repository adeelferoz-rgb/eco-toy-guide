import asyncio
import sys
import os
from datetime import datetime

# Add the backend directory to sys.path to allow imports from app
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import get_settings

settings = get_settings()

toys_data = [
    {
        "name": "Wooden Stacking Rings",
        "description": "A classic stacking toy made from sustainably sourced beech wood and painted with non-toxic, water-based dyes.",
        "brand": "EcoTots",
        "price": 24.99,
        "currency": "USD",
        "buy_link": "https://example.com/buy/wooden-stacking-rings",
        "materials": ["Beech Wood", "Water-based Paint"],
        "age_range": "1-3 years",
        "category": "Motor Skills",
        "image_url": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=3270&auto=format&fit=crop",
        "certification_ids": [],
        "created_at": datetime.utcnow()
    },
    {
        "name": "Organic Cotton Teddy Bear",
        "description": "Soft and cuddly teddy bear made from 100% GOTS certified organic cotton and stuffed with corn fiber.",
        "brand": "CuddleGreen",
        "price": 35.00,
        "currency": "USD",
        "buy_link": "https://example.com/buy/organic-teddy-bear",
        "materials": ["Organic Cotton", "Corn Fiber"],
        "age_range": "0+ years",
        "category": "Plush Toys",
        "image_url": "https://images.unsplash.com/photo-1559454403-b8fb87521bc7?q=80&w=3432&auto=format&fit=crop",
        "certification_ids": [],
        "created_at": datetime.utcnow()
    },
    {
        "name": "Recycled Plastic Dump Truck",
        "description": "Durable dump truck made from 100% recycled milk jugs. No metal axles or external coatings.",
        "brand": "GreenWheels",
        "price": 29.95,
        "currency": "USD",
        "buy_link": "https://example.com/buy/recycled-dump-truck",
        "materials": ["Recycled Plastic (HDPE)"],
        "age_range": "2-5 years",
        "category": "Vehicles",
        "image_url": "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=3270&auto=format&fit=crop",
        "certification_ids": [],
        "created_at": datetime.utcnow()
    },
    {
        "name": "Natural Rubber Teether",
        "description": "Soothing teether made from 100% natural rubber from Hevea trees. Free from BPA, PVC, and phthalates.",
        "brand": "PureChew",
        "price": 12.50,
        "currency": "USD",
        "buy_link": "https://example.com/buy/natural-rubber-teether",
        "materials": ["Natural Rubber"],
        "age_range": "0-18 months",
        "category": "Baby Gear",
        "image_url": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=3275&auto=format&fit=crop",
        "certification_ids": [],
        "created_at": datetime.utcnow()
    },
    {
        "name": "Solar Powered Robot Kit",
        "description": "Educational robot kit that teaches children about solar energy. No batteries required.",
        "brand": "FutureTech",
        "price": 45.00,
        "currency": "USD",
        "buy_link": "https://example.com/buy/solar-robot-kit",
        "materials": ["Recycled Plastic", "Solar Panels", "Electronic Components"],
        "age_range": "8-12 years",
        "category": "STEM",
        "image_url": "https://images.unsplash.com/photo-1535332371349-a5d229f49cb5?q=80&w=2665&auto=format&fit=crop",
        "certification_ids": [],
        "created_at": datetime.utcnow()
    },
    {
        "name": "Bamboo Building Blocks",
        "description": "Lightweight and durable building blocks made from rapidly renewable bamboo.",
        "brand": "BambooBuilds",
        "price": 39.99,
        "currency": "USD",
        "buy_link": "https://example.com/buy/bamboo-blocks",
        "materials": ["Bamboo"],
        "age_range": "3+ years",
        "category": "Construction",
        "image_url": "https://images.unsplash.com/photo-1587654780291-39c940483713?q=80&w=3270&auto=format&fit=crop",
        "certification_ids": [],
        "created_at": datetime.utcnow()
    },
    {
        "name": "Eco-Dough Modeling Clay",
        "description": "All-natural modeling dough made with flour, salt, cream of tartar, oil, and vegetable dyes.",
        "brand": "NaturePlay",
        "price": 18.00,
        "currency": "USD",
        "buy_link": "https://example.com/buy/eco-dough",
        "materials": ["Flour", "Salt", "Vegetable Oil", "Natural Dyes"],
        "age_range": "3+ years",
        "category": "Arts & Crafts",
        "image_url": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=3271&auto=format&fit=crop",
        "certification_ids": [],
        "created_at": datetime.utcnow()
    },
    {
        "name": "Cardboard Castle Playhouse",
        "description": "Easy-to-assemble playhouse made from high-strength, recycled cardboard. Customizable with paints or markers.",
        "brand": "BoxForts",
        "price": 55.00,
        "currency": "USD",
        "buy_link": "https://example.com/buy/cardboard-castle",
        "materials": ["Recycled Cardboard"],
        "age_range": "3-8 years",
        "category": "Pretend Play",
        "image_url": "https://images.unsplash.com/photo-1612460067802-9159235e828d?q=80&w=3024&auto=format&fit=crop",
        "certification_ids": [],
        "created_at": datetime.utcnow()
    },
    # New Products for Testing
    {
        "name": "Wooden Shape Sorter",
        "description": "A classic shape sorter made from FSC certified rubberwood. Helps develop problem-solving skills.",
        "brand": "EcoTots",
        "price": 22.50,
        "currency": "USD",
        "buy_link": "https://example.com/buy/shape-sorter",
        "materials": ["FSC Rubberwood", "Water-based Paint"],
        "age_range": "1-3 years",
        "category": "Motor Skills",
        "image_url": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=3275&auto=format&fit=crop",
        "certification_ids": [],
        "created_at": datetime.utcnow()
    },
    {
        "name": "Organic Cotton Doll",
        "description": "Handmade doll with 100% organic cotton outer and corn fiber fill. Safe and soft for all ages.",
        "brand": "CuddleGreen",
        "price": 28.00,
        "currency": "USD",
        "buy_link": "https://example.com/buy/organic-doll",
        "materials": ["Organic Cotton", "Corn Fiber"],
        "age_range": "0-12 months",
        "category": "Plush Toys",
        "image_url": "https://images.unsplash.com/photo-1555447405-058428d6556a?q=80&w=3270&auto=format&fit=crop",
        "certification_ids": [],
        "created_at": datetime.utcnow()
    },
    {
        "name": "Recycled Plastic Submarine",
        "description": "Ready for underwater adventures! Made from 100% recycled plastic milk jugs.",
        "brand": "GreenWheels",
        "price": 15.99,
        "currency": "USD",
        "buy_link": "https://example.com/buy/recycled-submarine",
        "materials": ["Recycled Plastic (HDPE)"],
        "age_range": "3-5 years",
        "category": "Bath Toys",
        "image_url": "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=3270&auto=format&fit=crop",
        "certification_ids": [],
        "created_at": datetime.utcnow()
    },
    {
        "name": "DIY Birdhouse Kit",
        "description": "Build and paint your own birdhouse. Made from pine wood. Paints and brush included.",
        "brand": "NaturePlay",
        "price": 19.95,
        "currency": "USD",
        "buy_link": "https://example.com/buy/birdhouse-kit",
        "materials": ["Pine Wood", "Acrylic Paint"],
        "age_range": "5-8 years",
        "category": "Arts & Crafts",
        "image_url": "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?q=80&w=3270&auto=format&fit=crop",
        "certification_ids": [],
        "created_at": datetime.utcnow()
    },
    {
        "name": "Wooden Balance Bike",
        "description": "A pedal-free bike to help toddlers learn balance and coordination. Adjustable seat height.",
        "brand": "EcoRide",
        "price": 85.00,
        "currency": "USD",
        "buy_link": "https://example.com/buy/balance-bike",
        "materials": ["Birch Plywood", "Rubber Tires"],
        "age_range": "1-3 years",
        "category": "Ride-on",
        "image_url": "https://images.unsplash.com/photo-1621460244978-659f8125956f?q=80&w=3387&auto=format&fit=crop",
        "certification_ids": [],
        "created_at": datetime.utcnow()
    },
    {
        "name": "Solar System Puzzle",
        "description": "48-piece floor puzzle made from recycled cardboard and printed with soy-based inks.",
        "brand": "BrainyKids",
        "price": 16.50,
        "currency": "USD",
        "buy_link": "https://example.com/buy/solar-system-puzzle",
        "materials": ["Recycled Cardboard", "Soy Ink"],
        "age_range": "3-5 years",
        "category": "Puzzles",
        "image_url": "https://images.unsplash.com/photo-1606092195730-5d7b9af1ef4d?q=80&w=3270&auto=format&fit=crop",
        "certification_ids": [],
        "created_at": datetime.utcnow()
    },
    {
        "name": "Organic Finger Paints",
        "description": "Safe, edible finger paints made from organic fruit and vegetable extracts.",
        "brand": "SafeColors",
        "price": 21.00,
        "currency": "USD",
        "buy_link": "https://example.com/buy/organic-finger-paints",
        "materials": ["Organic Fruit/Veg Extracts", "Corn Starch"],
        "age_range": "1-3 years",
        "category": "Arts & Crafts",
        "image_url": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=3270&auto=format&fit=crop",
        "certification_ids": [],
        "created_at": datetime.utcnow()
    },
    {
        "name": "Wind Power Experiment Kit",
        "description": "Build a working wind turbine and learn about renewable energy. Great for STEM learning.",
        "brand": "FutureTech",
        "price": 38.00,
        "currency": "USD",
        "buy_link": "https://example.com/buy/wind-turbine-kit",
        "materials": ["Recycled Plastic", "Electronic Motor"],
        "age_range": "8+ years",
        "category": "STEM",
        "image_url": "https://images.unsplash.com/photo-1453232873136-1f3c301cb4d4?q=80&w=3347&auto=format&fit=crop",
        "certification_ids": [],
        "created_at": datetime.utcnow()
    }
]

async def seed_toys():
    print(f"Connecting to MongoDB at {settings.MONGODB_URI}...")
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.DATABASE_NAME]
    
    # Fetch certifications to map them
    cert_collection = db.certifications
    toys_collection = db.toys

    print("Fetching certifications map...")
    certs = await cert_collection.find().to_list(length=100)
    cert_map = {c["slug"]: str(c["_id"]) for c in certs}
    
    # Helper to attach cert IDs based on toy properties (simple logic for seeding)
    def attach_certs(toy):
        ids = []
        # FSC logic: if wood/paper based
        if "Wood" in str(toy["materials"]) or "Cardboard" in str(toy["materials"]):
            if "fsc" in cert_map: ids.append(cert_map["fsc"])
        
        # GOTS logic: if organic cotton
        if "Organic Cotton" in str(toy["materials"]):
            if "gots" in cert_map: ids.append(cert_map["gots"])
            
        # Recycled Plastic logic (Green Seal maybe?)
        if "Recycled Plastic" in str(toy["materials"]):
             if "green-seal" in cert_map: ids.append(cert_map["green-seal"])

        # Oeko-Tex generic safety for fabrics
        if "Cotton" in str(toy["materials"]) or "Plush" in toy["category"]:
             if "oeko-tex" in cert_map: ids.append(cert_map["oeko-tex"])

        return list(set(ids)) # unique

    print("Seeding toys...")
    
    # Clear existing toys to avoid duplicates or stale data
    await toys_collection.delete_many({})
    print("Cleared existing toys.")

    # Process data to add certs
    final_toys = []
    for toy in toys_data:
        toy["certification_ids"] = attach_certs(toy)
        final_toys.append(toy)

    result = await toys_collection.insert_many(final_toys)
    print(f"Inserted {len(result.inserted_ids)} toys.")

    client.close()
    print("Seeding complete.")

if __name__ == "__main__":
    asyncio.run(seed_toys())