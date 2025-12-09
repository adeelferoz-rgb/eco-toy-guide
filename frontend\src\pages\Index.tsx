import { ToyBrick, Heart, X, Sparkles } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchToys, Toy, saveToy, unsaveToy, fetchSavedToys, ToyFilters } from "../services/toys";
import { authService } from "../services/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AuthDialog } from "@/components/auth/AuthDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const Index = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isAuthenticated = authService.isAuthenticated();

  const [filters, setFilters] = useState<ToyFilters>({
    category: "all",
    age_range: "all",
    max_price: 100,
    recommend: isAuthenticated, // Default to recommended if logged in
  });

  // Re-enable recommend default if user logs in during session
  useEffect(() => {
    if (isAuthenticated) {
      setFilters(prev => ({ ...prev, recommend: true }));
    }
  }, [isAuthenticated]);

  const { data: toys, isLoading, error } = useQuery({
    queryKey: ["toys", filters],
    queryFn: () => fetchToys(filters),
  });

  const { data: savedToys } = useQuery({
    queryKey: ["saved-toys"],
    queryFn: fetchSavedToys,
    enabled: isAuthenticated,
  });

  const savedToyIds = savedToys?.map((t) => t._id) || [];

  const saveMutation = useMutation({
    mutationFn: saveToy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-toys"] });
      toast({
        title: "Toy saved",
        description: "This toy has been added to your saved list.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save toy.",
        variant: "destructive",
      });
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: unsaveToy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-toys"] });
      toast({
        title: "Toy removed",
        description: "This toy has been removed from your saved list.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove toy.",
        variant: "destructive",
      });
    },
  });

  const handleToggleSave = (toyId: string) => {
    if (savedToyIds.includes(toyId)) {
      unsaveMutation.mutate(toyId);
    } else {
      saveMutation.mutate(toyId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <ToyBrick className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Eco-Friendly Toys</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Explore our collection of sustainable, safe, and educational toys for your little ones.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="w-full md:w-64 space-y-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Filters</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({ category: "all", age_range: "all", max_price: 100 })}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={filters.category}
              onValueChange={(value) => setFilters({ ...filters, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Puzzles">Puzzles</SelectItem>
                <SelectItem value="Building">Building</SelectItem>
                <SelectItem value="Arts & Crafts">Arts & Crafts</SelectItem>
                <SelectItem value="Role Play">Role Play</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Age Range</Label>
            <Select
              value={filters.age_range}
              onValueChange={(value) => setFilters({ ...filters, age_range: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Age Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ages</SelectItem>
                <SelectItem value="0-12 months">0-12 months</SelectItem>
                <SelectItem value="1-3 years">1-3 years</SelectItem>
                <SelectItem value="3-5 years">3-5 years</SelectItem>
                <SelectItem value="5-8 years">5-8 years</SelectItem>
                <SelectItem value="8+ years">8+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
               <Label>Max Price</Label>
               <span className="text-sm text-gray-500">${filters.max_price}</span>
            </div>
            <Slider
              value={[filters.max_price || 100]}
              max={200}
              step={5}
              onValueChange={(value) => setFilters({ ...filters, max_price: value[0] })}
            />
          </div>
          
          {isAuthenticated && (
            <div className="flex items-center space-x-2 pt-4 border-t">
              <Switch
                id="recommend-mode"
                checked={filters.recommend}
                onCheckedChange={(checked) => setFilters({ ...filters, recommend: checked })}
              />
              <Label htmlFor="recommend-mode" className="cursor-pointer flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                Recommended for You
              </Label>
            </div>
          )}
        </div>

        <div className="flex-grow">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                 <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-500">
          <p>Failed to load toys. Please try again later.</p>
        </div>
      ) : (
        <>
          {toys && toys.length === 0 ? (
             <div className="text-center py-12 text-gray-500">
               <p className="text-lg">No toys found matching your filters.</p>
               <Button
                  variant="link"
                  onClick={() => setFilters({ category: "all", age_range: "all", max_price: 100 })}
               >
                 Clear all filters
               </Button>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {toys?.map((toy: Toy) => {
            const isSaved = savedToyIds.includes(toy._id);
            return (
              <Link to={`/toys/${toy._id}`} key={toy._id}>
                <Card className={`overflow-hidden hover:shadow-lg transition-shadow relative h-full flex flex-col ${(toy.match_score || 0) > 0 ? 'border-primary/50' : ''}`}>
                  {(toy.match_score || 0) > 0 && (
                     <div className="absolute top-2 left-2 z-10">
                        <Badge className="bg-primary/90 hover:bg-primary text-white flex gap-1 items-center">
                           <Sparkles className="h-3 w-3" />
                           Recommended
                        </Badge>
                     </div>
                  )}
                  <div className="absolute top-2 right-2 z-10">
                    {isAuthenticated ? (
                      <Button
                        variant="secondary"
                        size="icon"
                        className={`rounded-full bg-white/80 hover:bg-white shadow-sm ${
                          isSaved ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-red-500"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation(); // Prevent navigation when clicking save
                          handleToggleSave(toy._id);
                        }}
                      >
                        <Heart className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
                      </Button>
                    ) : (
                      <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                         <AuthDialog
                           trigger={
                             <Button
                               variant="secondary"
                               size="icon"
                               className="rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-red-500 shadow-sm"
                             >
                               <Heart className="h-5 w-5" />
                             </Button>
                           }
                           defaultTab="login"
                         />
                      </div>
                    )}
                  </div>
                  <div className="aspect-video w-full overflow-hidden bg-gray-100">
                    <img
                      src={toy.image_url}
                      alt={toy.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl flex justify-between items-start gap-2">
                       <span>{toy.name}</span>
                       {toy.price && (
                          <span className="text-lg font-bold text-primary shrink-0">
                             {toy.currency === "USD" ? "$" : toy.currency} {toy.price.toFixed(2)}
                          </span>
                       )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {toy.match_reason && (
                      <p className="text-xs font-medium text-primary mb-2 line-clamp-1">
                        {toy.match_reason}
                      </p>
                    )}
                    <CardDescription className="text-base line-clamp-3">
                      {toy.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
          )}
        </>
      )}
        </div>
      </div>
    </div>
  );
};

export default Index;