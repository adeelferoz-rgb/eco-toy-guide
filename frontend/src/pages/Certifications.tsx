import { useQuery } from "@tanstack/react-query";
import { fetchCertifications } from "@/services/certifications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

const Certifications = () => {
  const { data: certifications, isLoading, error } = useQuery({
    queryKey: ["certifications"],
    queryFn: fetchCertifications,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 min-h-[50vh] flex items-center justify-center">
        Error loading certifications. Please try again later.
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Eco-Toy Certifications</h1>
        <p className="text-lg text-gray-600 mt-2">
          Understand the labels that ensure your toys are safe and sustainable.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        {certifications?.map((cert) => (
          <Card key={cert.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <img
                  src={cert.logo}
                  alt={`${cert.name} logo`}
                  className="h-16 w-16 rounded-lg object-cover shadow-sm"
                />
                <CardTitle className="text-2xl">{cert.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Badge variant="secondary">What it is</Badge>
                <p className="text-gray-700 mt-1">{cert.description}</p>
              </div>
              <div>
                <Badge variant="secondary">What it means for toys</Badge>
                <p className="text-gray-700 mt-1">{cert.meaning}</p>
              </div>
              <div>
                <Badge variant="secondary">Environmental & Safety Value</Badge>
                <p className="text-gray-700 mt-1">{cert.impact}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Certifications;