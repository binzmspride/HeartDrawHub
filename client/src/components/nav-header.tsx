import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { ChevronDown } from "lucide-react";

export default function NavHeader() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <a className="font-['Dancing_Script'] text-2xl font-bold text-primary">HeartCanvas</a>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/draw">
              <a className={`font-medium transition duration-200 ${
                location === "/draw" ? "text-primary" : "text-gray-500 hover:text-primary"
              }`}>
                Draw
              </a>
            </Link>
            <Link href="/gallery">
              <a className={`font-medium transition duration-200 ${
                location === "/gallery" ? "text-primary" : "text-gray-500 hover:text-primary"
              }`}>
                My Hearts
              </a>
            </Link>
          </nav>
          
          {/* User Menu */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center">
                  <span className="mr-2 hidden sm:inline-block">{user?.username}</span>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-white">
                      {user?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem disabled>
                  {user?.username}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => logoutMutation.mutate()}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 py-2">
          <div className="flex space-x-4">
            <Link href="/draw">
              <a className={`flex-1 text-center py-2 rounded-md font-medium ${
                location === "/draw" 
                  ? "text-primary" 
                  : "text-gray-500 hover:text-primary"
              }`}>
                Draw
              </a>
            </Link>
            <Link href="/gallery">
              <a className={`flex-1 text-center py-2 rounded-md font-medium ${
                location === "/gallery" 
                  ? "text-primary" 
                  : "text-gray-500 hover:text-primary"
              }`}>
                My Hearts
              </a>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
