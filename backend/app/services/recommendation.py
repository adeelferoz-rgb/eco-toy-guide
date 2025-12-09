from typing import Dict, Any, Tuple
from app.models.toy import ToyResponse
from app.models.user import UserResponse

def calculate_match_score(toy: ToyResponse, user: UserResponse, certification_map: Dict[str, Any]) -> Tuple[int, str]:
    """
    Calculate a match score (0-100) and generate a reason string based on user preferences.
    """
    score = 0
    reasons = []

    # 1. Age Match
    # Simple string match for now as per requirements
    if user.child_age_range and toy.age_range == user.child_age_range:
        score += 50
        reasons.append("Perfect for your child's age.")

    # 2. Eco Match
    # Mapping Certification Slugs to potential User Eco Goals
    # In a real app, this relationship might be database-driven
    GOAL_MAPPINGS = {
        "fsc": ["Sustainable Wood", "Sustainable Materials", "Responsibly Sourced"],
        "gots": ["Organic Cotton", "Organic Materials", "Toxin-Free", "Plastic-Free"],
        "oeko-tex": ["Toxin-Free", "Safe Chemicals", "Safe for Kids"],
        "green-seal": ["Eco-Friendly", "Sustainable"],
        "certified-b-corp": ["Ethical Labor", "Social Responsibility"]
    }

    if user.eco_goals and toy.certification_ids:
        # We limit the eco score boost to avoid over-inflating, or just sum them up?
        # Prompt says: "+20 points per match."
        for cert_id in toy.certification_ids:
            cert = certification_map.get(cert_id)
            if cert:
                slug = cert.get("slug", "").lower()
                matched_goals = GOAL_MAPPINGS.get(slug, [])
                
                for goal in user.eco_goals:
                    # Case-insensitive match for goals
                    if any(g.lower() == goal.lower() for g in matched_goals):
                        score += 20
                        reasons.append(f"Matches your goal: {goal}.")

    # Cap score at 100
    score = min(score, 100)
    
    return score, " ".join(reasons)