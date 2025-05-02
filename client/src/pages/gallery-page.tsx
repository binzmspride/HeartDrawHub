import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Loader2 } from "lucide-react";
import NavHeader from "@/components/nav-header";
import HeartCard from "@/components/heart-card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface Drawing {
  id: number;
  userId: number;
  name: string;
  imageData: string;
  createdAt: string;
}

export default function GalleryPage() {
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  
  // Fetch user's drawings
  const { 
    data: drawings, 
    isLoading, 
    error 
  } = useQuery<Drawing[]>({ 
    queryKey: ["/api/drawings"]
  });

  // Delete drawing mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/drawings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/drawings"] });
      toast({
        title: "Heart deleted",
        description: "Your drawing has been deleted"
      });
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Handle drawing deletion
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this heart?")) {
      deleteMutation.mutate(id);
    }
  };

  // Handle drawing edit (navigate to draw page with the drawing)
  const handleEdit = (id: number) => {
    setLocation(`/draw?id=${id}`);
  };

  // Handle download drawing
  const handleDownload = (drawing: Drawing) => {
    const link = document.createElement('a');
    link.href = drawing.imageData;
    link.download = `${drawing.name.replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col">
        <div className="py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">My Hearts</h2>
            <p className="text-gray-500">Your saved heart creations</p>
          </div>
          <Button onClick={() => setLocation("/draw")}>
            <Plus className="mr-2 h-4 w-4" /> New Heart
          </Button>
        </div>
        
        <Card className="flex-grow">
          <CardContent className="pt-6">
            {/* Loading State */}
            {isLoading && (
              <div className="py-8 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="mx-auto h-8 w-8 text-primary animate-spin mb-4" />
                  <p className="text-gray-500">Loading your heart creations...</p>
                </div>
              </div>
            )}
            
            {/* Error State */}
            {error && (
              <div className="py-8 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-red-500">Error loading drawings: {error.message}</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/drawings"] })}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}
            
            {/* Empty State */}
            {!isLoading && !error && (!drawings || drawings.length === 0) && (
              <div className="py-12 flex flex-col items-center justify-center">
                <svg className="mb-4 h-32 w-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 85C73.5 55 87 38.5 87 27.5C87 12.8 72.5 5 60 15.5C55 20 51.5 25.5 50 30C48.5 25.5 45 20 40 15.5C27.5 5 13 12.8 13 27.5C13 38.5 26.5 55 50 85Z" fill="#fce4ec"/>
                  <path d="M50 65C63.5 45 72 35.5 72 27.5C72 17.8 62.5 12 55 19.5C52 22 50.5 25.5 50 28C49.5 25.5 48 22 45 19.5C37.5 12 28 17.8 28 27.5C28 35.5 36.5 45 50 65Z" stroke="#e91e63" strokeWidth="2"/>
                </svg>
                <h3 className="font-medium text-xl text-gray-700 mb-2">No hearts yet</h3>
                <p className="text-gray-500 text-center max-w-xs mb-4">Start creating beautiful heart art to see them here.</p>
                <Button onClick={() => setLocation("/draw")}>
                  Create Your First Heart
                </Button>
              </div>
            )}
            
            {/* Gallery Grid */}
            {!isLoading && !error && drawings && drawings.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {drawings.map((drawing) => (
                  <HeartCard
                    key={drawing.id}
                    drawing={drawing}
                    onEdit={() => handleEdit(drawing.id)}
                    onDelete={() => handleDelete(drawing.id)}
                    onDownload={() => handleDownload(drawing)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
