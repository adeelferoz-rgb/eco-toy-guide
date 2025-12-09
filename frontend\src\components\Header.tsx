import { Link } from "react-router-dom";
import { Leaf, ToyBrick, Heart, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { authService } from "@/services/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const isAuthenticated = authService.isAuthenticated();

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Leaf className="h-8 w-8 text-green-600" />
          <span className="text-2xl font-bold text-gray-800">Eco Toy Guide</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-4">
          <Link to="/discover" className="text-gray-600 hover:text-green-600 flex items-center space-x-1">
            <ToyBrick className="h-5 w-5" />
            <span>Discover Toys</span>
          </Link>
          <Link to="/certifications" className="text-gray-600 hover:text-green-600 flex items-center space-x-1">
            <Leaf className="h-5 w-5" />
            <span>Certifications</span>
          </Link>
          <Link to="/saved" className="text-gray-600 hover:text-green-600 flex items-center space-x-1">
            <Heart className="h-5 w-5" />
            <span>Saved Toys</span>
          </Link>
        </nav>
        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <AuthDialog trigger={<Button variant="ghost">Login</Button>} defaultTab="login" />
              <AuthDialog trigger={<Button>Sign Up</Button>} defaultTab="signup" />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;