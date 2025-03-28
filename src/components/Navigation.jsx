"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Globe, Heart, Menu, X } from "lucide-react"
import { Link } from "react-router"
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react"
import { useGetUserFavoritesQuery } from "@/lib/api"

function Navigation() {
  const { user, isSignedIn } = useUser()
  const [favoritesCount, setFavoritesCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Fetch favorites data
  const { data: favorites = [], isLoading } = useGetUserFavoritesQuery(undefined, {
    skip: !isSignedIn,
  })

  // Update favorites count when data changes
  useEffect(() => {
    if (!isLoading && favorites) {
      setFavoritesCount(favorites.length)
    }
  }, [favorites, isLoading])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (mobileMenuOpen) setMobileMenuOpen(false)
    }

    // Add event listener only when menu is open
    if (mobileMenuOpen) {
      document.addEventListener("click", handleClickOutside)
    }

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [mobileMenuOpen])

  const toggleMobileMenu = (e) => {
    e.stopPropagation() // Prevent the click from bubbling to document
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <nav className="z-10 bg-black text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            Horizone
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="transition-colors hover:text-gray-300">
              Home
            </Link>
            <Link to="/hotels" className="transition-colors hover:text-gray-300">
              Hotels
            </Link>

            {user?.publicMetadata?.role === "admin" && (
              <Link to="/hotels/create" className="transition-colors hover:text-gray-300">
                Create Hotel
              </Link>
            )}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost">
              <Globe className="h-5 w-5 mr-2" />
              EN
            </Button>
            <Link to="/favorites" className="transition-colors flex items-center hover:text-gray-300">
              <Heart className="h-5 w-5 mr-2" />
              {isSignedIn && <span className="text-sm">{isLoading ? "..." : favoritesCount}</span>}
            </Link>
            <SignedOut>
              <Button variant="ghost" asChild>
                <Link to="/sign-in">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/sign-up">Sign Up</Link>
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
              <Button asChild>
                <Link to="/account">My Account</Link>
              </Button>
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Link to="/favorites" className="mr-4 flex items-center">
              <Heart className="h-5 w-5 mr-1" />
              {isSignedIn && <span className="text-sm">{isLoading ? "..." : favoritesCount}</span>}
            </Link>
            <button onClick={toggleMobileMenu} className="focus:outline-none" aria-label="Toggle menu">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-700" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col space-y-4">
              <Link to="/" className="transition-colors hover:text-gray-300" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link
                to="/hotels"
                className="transition-colors hover:text-gray-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Hotels
              </Link>

              {user?.publicMetadata?.role === "admin" && (
                <Link
                  to="/hotels/create"
                  className="transition-colors hover:text-gray-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Hotel
                </Link>
              )}

              <div className="flex items-center space-x-2 py-2">
                <Button variant="ghost" size="sm">
                  <Globe className="h-4 w-4 mr-2" />
                  EN
                </Button>
              </div>

              <div className="pt-2 border-t border-gray-700">
                <SignedOut>
                  <div className="flex flex-col space-y-2">
                    <Button variant="ghost" asChild className="justify-start">
                      <Link to="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                        Login
                      </Link>
                    </Button>
                    <Button asChild className="justify-start">
                      <Link to="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                </SignedOut>
                <SignedIn>
                  <div className="flex items-center space-x-4">
                    <UserButton />
                    <Button asChild size="sm">
                      <Link to="/account" onClick={() => setMobileMenuOpen(false)}>
                        My Account
                      </Link>
                    </Button>
                  </div>
                </SignedIn>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation;

