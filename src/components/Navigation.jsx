import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import {useSelector} from "react-redux";

function Navigation() {
  return (
    <nav className="z-10 bg-black flex justify-between px-8 text-white py-4">
      {/* Left Section */}
      <div className="flex items-center space-x-8">
        <Link to="/" className="text-2xl font-bold">
          Horizone
        </Link>
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="transition-colors">
            Home
          </Link>
          <Link to="/hotels/create" className="transition-colors">
            Create Hotel
          </Link>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost">
          <Globe className="h-5 w-5 mr-2" />
          EN
        </Button>
        <Button variant="ghost" asChild>
            <Link to="/sign-in">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/sign-up">Sign Up</Link>
          </Button>
       
        {/* <p>{userSlice.user.name}</p> */}
      </div>
    </nav>
  );
}

export default Navigation;
