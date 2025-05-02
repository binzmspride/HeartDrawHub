import { useState, useEffect } from "react";
import { Switch, Route, Redirect, Router as WouterRouter } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

// Import all pages
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import DrawingPage from "@/pages/drawing-page";
import GalleryPage from "@/pages/gallery-page";

// Content that will be rendered after authentication is setup
function AuthenticatedContent() {
  // Display a simple loading state initially
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Simulate a brief loading period to ensure everything is initialized
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="mt-4 text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }
  
  return (
    <TooltipProvider>
      <Toaster />
      <WouterRouter>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/draw" component={DrawingPage} />
          <Route path="/gallery" component={GalleryPage} />
          <Route path="/auth" component={AuthPage} />
          <Route component={NotFound} />
        </Switch>
      </WouterRouter>
    </TooltipProvider>
  );
}

// Routes component that wraps everything with AuthProvider
export function Routes() {
  return (
    <AuthProvider>
      <AuthenticatedContent />
    </AuthProvider>
  );
}