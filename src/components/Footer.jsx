import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react"
import { Link } from "react-router"

function Footer() {
  return (
    <footer className="bg-black text-white pt-12 pb-6">
      <div className="container mx-auto px-8">
        {/* Main Footer Content */}
        <div className="flex flex-wrap justify-between gap-8">
          {/* Company Info */}
          <div className="md:w-1/2">
            <Link to="/" className="text-2xl font-bold">
              Horizone
            </Link>
            <p className="mt-4 text-gray-400">
              Discover extraordinary stays around the world with Horizone's curated selection of premium hotels and
              accommodations.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:w-1/4">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/hotels" className="text-gray-400 hover:text-white transition-colors">
                  Hotels
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-gray-400 hover:text-white transition-colors">
                  Wish List
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-10 pt-6 border-t border-gray-800">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} Horizone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
