import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getToyById, saveToy, unsaveToy, fetchSavedToys } from "../services/toys";
import { fetchCertifications } from "../services/certifications";
import { authService } from "../services/auth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { ArrowLeft, Heart, ShoppingBag, ShieldCheck, Tag, Info, Layers, User } from "lucide-react";

const ToyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isAuthenticated = authService.isAuthenticated();

  const { data: toy, isLoading, error } = useQuery({
    queryKey: ["toy", id],
    queryFn: () => getToyById(id!),
    enabled: !!id,
  });

  const { data: savedToys } = useQuery({
    queryKey: ["saved-toys"],
    queryFn: fetchSavedToys,
    enabled: isAuthenticated,
  });

  const { data: allCertifications } = useQuery({
    queryKey: ["certifications"],
    queryFn: fetchCertifications,
  });

  const isSaved = savedToys?.some((t) => t._id === id);

  // Get certifications for this toy
  const toyCertifications = allCertifications?.filter(cert => 
    toy?.certification_ids?.includes(cert._id || cert.id)
  ) || [];

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

  const handleToggleSave = () => {
    if (!id) return;
    if (isSaved) {
      unsaveMutation.mutate(id);
    } else {
      saveMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-[400px] w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !toy) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error loading toy</h1>
        <p className="mb-4">We couldn't find the toy you're looking for.</p>
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Toys
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/">
        <Button variant="ghost" className="mb-6 pl-0 hover:pl-2 transition-all">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Collection
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-100 border shadow-sm">
            <img
              src={toy.image_url}
              alt={toy.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {/* Placeholder for additional images if we had them */}
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-gray-100 overflow-hidden cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                <img
                  src={toy.image_url}
                  alt={`${toy.name} view ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between">
               <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{toy.name}</h1>
                  {toy.brand && (
                    <p className="text-lg text-primary font-medium flex items-center">
                      <Tag className="h-4 w-4 mr-1" /> {toy.brand}
                    </p>
                  )}
               </div>
               <div className="flex flex-col items-end">
                  {toy.price && (
                     <div className="text-3xl font-bold text-gray-900">
                        {toy.currency === "USD" ? "$" : toy.currency} {toy.price.toFixed(2)}
                     </div>
                  )}
               </div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-wrap gap-2">
             {toy.category && (
               <Badge variant="secondary" className="text-sm">
                 <Layers className="h-3 w-3 mr-1" /> {toy.category}
               </Badge>
             )}
             {toy.age_range && (
               <Badge variant="outline" className="text-sm border-primary text-primary">
                 <User className="h-3 w-3 mr-1" /> {toy.age_range}
               </Badge>
             )}
          </div>

          <p className="text-gray-600 leading-relaxed text-lg">
            {toy.description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {toy.materials && toy.materials.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Info className="h-4 w-4 mr-2 text-blue-500" /> Materials
                    </h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {toy.materials.map((material, idx) => (
                            <li key={idx}>{material}</li>
                        ))}
                    </ul>
                </div>
            )}
          </div>

          {/* Eco-Certifications Section */}
          {toyCertifications.length > 0 && (
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-4 flex items-center text-lg">
                <ShieldCheck className="h-5 w-5 mr-2" /> Eco-Certifications
              </h3>
              <div className="space-y-4">
                {toyCertifications.map((cert) => (
                  <div key={cert._id || cert.id} className="bg-white p-4 rounded-md border border-green-100">
                    <div className="flex items-start gap-3 mb-2">
                      <img 
                        src={cert.logo} 
                        alt={cert.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{cert.meaning}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/certifications">
                <Button variant="link" className="mt-3 p-0 h-auto text-green-700 hover:text-green-800">
                  Learn more about certifications →
                </Button>
              </Link>
            </div>
          )}

          <div className="pt-6 flex flex-col sm:flex-row gap-4">
            {toy.buy_link ? (
              <Button size="lg" className="w-full sm:flex-1 text-lg h-12" asChild>
                <a href={toy.buy_link} target="_blank" rel="noopener noreferrer">
                  <ShoppingBag className="mr-2 h-5 w-5" /> Buy Now
                </a>
              </Button>
            ) : (
               <Button size="lg" className="w-full sm:flex-1 text-lg h-12" disabled>
                  <ShoppingBag className="mr-2 h-5 w-5" /> Out of Stock
               </Button>
            )}

            {isAuthenticated ? (
              <Button
                size="lg"
                variant={isSaved ? "secondary" : "outline"}
                className={`w-full sm:w-auto h-12 px-6 ${
                  isSaved ? "text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 border-red-200" : ""
                }`}
                onClick={handleToggleSave}
                disabled={saveMutation.isPending || unsaveMutation.isPending}
              >
                <Heart className={`mr-2 h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
                {isSaved ? "Saved" : "Save for Later"}
              </Button>
            ) : (
              <AuthDialog
                trigger={
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-6">
                    <Heart className="mr-2 h-5 w-5" /> Save for Later
                  </Button>
                }
                defaultTab="login"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToyDetail;