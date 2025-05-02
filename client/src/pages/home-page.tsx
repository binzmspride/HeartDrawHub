import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import NavHeader from "@/components/nav-header";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const [_, setLocation] = useLocation();
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <NavHeader />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary font-['Dancing_Script'] mb-4">
              Welcome to HeartCanvas
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Express your love through beautiful heart drawings. Create, save, and share your heartfelt creations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="hover:shadow-md transition duration-200">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <svg className="h-32 w-32 mb-6" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 85C73.5 55 87 38.5 87 27.5C87 12.8 72.5 5 60 15.5C55 20 51.5 25.5 50 30C48.5 25.5 45 20 40 15.5C27.5 5 13 12.8 13 27.5C13 38.5 26.5 55 50 85Z" fill="#e91e63"/>
                </svg>
                <h2 className="text-2xl font-semibold mb-3">Create Heart Drawings</h2>
                <p className="text-gray-600 mb-6">
                  Use our intuitive drawing tools to create beautiful heart designs. Express your creativity and love!
                </p>
                <Button onClick={() => setLocation("/draw")}>
                  Start Drawing
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition duration-200">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="h-32 w-32 mb-6 grid grid-cols-2 gap-2">
                  <svg className="col-span-1" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 85C73.5 55 87 38.5 87 27.5C87 12.8 72.5 5 60 15.5C55 20 51.5 25.5 50 30C48.5 25.5 45 20 40 15.5C27.5 5 13 12.8 13 27.5C13 38.5 26.5 55 50 85Z" fill="#ff4081"/>
                  </svg>
                  <svg className="col-span-1" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 85C73.5 55 87 38.5 87 27.5C87 12.8 72.5 5 60 15.5C55 20 51.5 25.5 50 30C48.5 25.5 45 20 40 15.5C27.5 5 13 12.8 13 27.5C13 38.5 26.5 55 50 85Z" fill="#f50057"/>
                  </svg>
                  <svg className="col-span-1" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 85C73.5 55 87 38.5 87 27.5C87 12.8 72.5 5 60 15.5C55 20 51.5 25.5 50 30C48.5 25.5 45 20 40 15.5C27.5 5 13 12.8 13 27.5C13 38.5 26.5 55 50 85Z" fill="#c2185b"/>
                  </svg>
                  <svg className="col-span-1" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 85C73.5 55 87 38.5 87 27.5C87 12.8 72.5 5 60 15.5C55 20 51.5 25.5 50 30C48.5 25.5 45 20 40 15.5C27.5 5 13 12.8 13 27.5C13 38.5 26.5 55 50 85Z" fill="#880e4f"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold mb-3">View Your Gallery</h2>
                <p className="text-gray-600 mb-6">
                  Browse your saved heart creations in your personal gallery. Download, edit, or share your favorites.
                </p>
                <Button onClick={() => setLocation("/gallery")}>
                  View Gallery
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-light rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold mb-3">Ready to Create?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Start expressing your feelings through heart art. Our easy-to-use tools make it simple to create beautiful designs.
            </p>
            <Button size="lg" onClick={() => setLocation("/draw")}>
              Create Your First Heart
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
