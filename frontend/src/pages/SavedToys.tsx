import { Heart } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSavedToys, unsaveToy, Toy } from "../services/toys";
import { authService } from "../services/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const SavedToys = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isAuthenticated = authService.isAuthenticated();

  const { data: savedToys, isLoading, error } = useQuery({
    queryKey: ["saved-toys"],
    queryFn: fetchSavedToys,
    enabled: isAuthenticated,
  });

  const unsaveMutation = useMutation({
    mutationFn: unsaveToy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-toys"] });
      toast({
        title: "Toy removed",
        description: "The toy has been removed from your saved list.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove toy from saved list.",
        variant: "destructive",
      });
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Saved Toys</h1>
        <p className="text-gray-600 mb-4">Please log in to view your saved toys.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <Heart className="mx-auto h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Saved Toys</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Keep track of your favorite eco-friendly toys.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
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
          <p>Failed to load saved toys. Please try again later.</p>
        </div>
      ) : savedToys && savedToys.length === 0 ? (
        <div className="text-center text-gray-600">
            <p className="mb-4">You haven't saved any toys yet.</p>
            <Button asChild>
                <Link to="/">Discover Toys</Link>
            </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedToys?.map((toy: Toy) => (
            <Card key={toy._id} className="overflow-hidden hover:shadow-lg transition-shadow relative">
              <div className="absolute top-2 right-2 z-10">
                <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full bg-white/80 hover:bg-white text-red-500 hover:text-red-600 shadow-sm"
                    onClick={(e) => {
                        e.preventDefault();
                        unsaveMutation.mutate(toy._id);
                    }}
                >
                    <Heart className="h-5 w-5 fill-current" />
                </Button>
              </div>
              <div className="aspect-video w-full overflow-hidden bg-gray-100">
                <img
                  src={toy.image_url}
                  alt={toy.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{toy.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {toy.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedToys;