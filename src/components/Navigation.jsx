import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

function Navigation() {
  return (
    <nav className="z-10 bg-black flex justify-between px-8 text-white py-4">
      {/* Left Section */}
      <div className="flex items-center space-x-8">
        <a href="/" className="text-2xl font-bold">
          Horizone
        </a>
        <div className="hidden md:flex space-x-6">
          <a href="/" className="transition-colors">
            Home
          </a>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost">
          <Globe className="h-5 w-5 mr-2" />
          EN
        </Button>
        <Button variant="ghost" asChild>
            <a href="/sign-in">Login</a>
          </Button>
          <Button asChild>
            <a href="/sign-up">Sign Up</a>
          </Button>
       
      </div>
    </nav>
  );
}

export default Navigation;
