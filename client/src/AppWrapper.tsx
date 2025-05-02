import { Switch, Route, Redirect } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import DrawingPage from "@/pages/drawing-page";
import GalleryPage from "@/pages/gallery-page";
import { useAuth } from "@/hooks/use-auth";

// Wrapper component that will be used inside the AuthProvider
export function AppContent() {
  const { user, isLoading } = useAuth();
  
  // Show loading spinner while auth state is loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Toaster />
      <Switch>
        {/* Protected routes - only accessible if user is logged in */}
        {user ? (
          <>
            <Route path="/" component={HomePage} />
            <Route path="/draw" component={DrawingPage} />
            <Route path="/gallery" component={GalleryPage} />
          </>
        ) : (
          // Redirect to auth if accessing protected routes while not logged in
          <>
            <Route path="/">
              <Redirect to="/auth" />
            </Route>
            <Route path="/draw">
              <Redirect to="/auth" />
            </Route>
            <Route path="/gallery">
              <Redirect to="/auth" />
            </Route>
          </>
        )}
        {/* Public routes - always accessible */}
        <Route path="/auth" component={AuthPage} />
        <Route component={NotFound} />
      </Switch>
    </TooltipProvider>
  );
}