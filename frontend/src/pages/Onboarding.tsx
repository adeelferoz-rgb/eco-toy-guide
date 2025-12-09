import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usersService, UserUpdateData } from "../services/users";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useToast } from "../hooks/use-toast";
import { Loader2 } from "lucide-react";
import { authService } from "../services/auth";

const AGE_RANGES = [
  "0-12 months",
  "1-3 years",
  "3-5 years",
  "5-8 years",
  "8-12 years",
  "12+ years",
];

const ECO_GOALS = [
  "Plastic-Free",
  "Recyclable",
  "Biodegradable",
  "Sustainably Sourced",
  "Carbon Neutral",
  "Second-hand",
];

const INTERESTS = [
  "Puzzles",
  "Building",
  "Arts & Crafts",
  "Science & Nature",
  "Music",
  "Role Play",
  "Active Play",
  "Vehicles",
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [formData, setFormData] = useState<UserUpdateData>({
    child_age_range: "",
    eco_goals: [],
    interests: [],
  });

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/");
      return;
    }

    const loadProfile = async () => {
      try {
        const profile = await usersService.getProfile();
        setFormData({
          child_age_range: profile.child_age_range || "",
          eco_goals: profile.eco_goals || [],
          interests: profile.interests || [],
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load profile settings",
          variant: "destructive",
        });
      } finally {
        setFetching(false);
      }
    };

    loadProfile();
  }, [navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await usersService.updateProfile(formData);
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      // Optionally navigate somewhere else or stay here
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleEcoGoal = (goal: string) => {
    setFormData((prev) => {
      const goals = prev.eco_goals || [];
      if (goals.includes(goal)) {
        return { ...prev, eco_goals: goals.filter((g) => g !== goal) };
      } else {
        return { ...prev, eco_goals: [...goals, goal] };
      }
    });
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => {
      const interests = prev.interests || [];
      if (interests.includes(interest)) {
        return { ...prev, interests: interests.filter((i) => i !== interest) };
      } else {
        return { ...prev, interests: [...interests, interest] };
      }
    });
  };

  if (fetching) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Your Preferences</h1>
      <p className="mb-8 text-muted-foreground">
        Help us personalize your experience by telling us a bit more about what you're looking for.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Who are you buying for?</h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">Child's Age Range</label>
            <Select
              value={formData.child_age_range}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, child_age_range: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an age range" />
              </SelectTrigger>
              <SelectContent>
                {AGE_RANGES.map((age) => (
                  <SelectItem key={age} value={age}>
                    {age}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Eco-Friendly Goals</h2>
          <p className="text-sm text-muted-foreground">
            Select the environmental features that matter most to you.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {ECO_GOALS.map((goal) => (
              <div key={goal} className="flex items-center space-x-2">
                <Checkbox
                  id={`goal-${goal}`}
                  checked={formData.eco_goals?.includes(goal)}
                  onCheckedChange={() => toggleEcoGoal(goal)}
                />
                <label
                  htmlFor={`goal-${goal}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {goal}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Interests</h2>
          <p className="text-sm text-muted-foreground">
            What types of play are they interested in?
          </p>
          <div className="grid grid-cols-2 gap-4">
            {INTERESTS.map((interest) => (
              <div key={interest} className="flex items-center space-x-2">
                <Checkbox
                  id={`interest-${interest}`}
                  checked={formData.interests?.includes(interest)}
                  onCheckedChange={() => toggleInterest(interest)}
                />
                <label
                  htmlFor={`interest-${interest}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {interest}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={loading} size="lg">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}