import { Button } from "@/components/ui/button";
import { Globe, Search, Shield, Building } from "lucide-react";
import { Link } from "react-router";
import {  SignedOut} from "@clerk/clerk-react";

function AboutUs() {
  return (
    <div className="bg-white text-gray-900">
     {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-[#E5E7EB] to-white border-t border-gray-200">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: Text Content */}
            <div className="order-2 md:order-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">About Horizone</h1>
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">
                Connecting Travelers to Extraordinary Stays
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed text-sm md:text-base">
                At Horizone, we believe travel should be seamless, inspiring, and unforgettable. Founded with a passion for
                exploration, we’re here to help you discover the perfect stay—anywhere in the world.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed text-sm md:text-base">
                From boutique hotels to luxury resorts, our curated selection ensures quality, transparency, and a delightful
                booking experience for every journey.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-black text-white hover:bg-gray-800 transition-all duration-300"
              >
                <Link to="/hotels">Explore Hotels</Link>
              </Button>
            </div>
            {/* Right: Image */}
            <div className="order-1 md:order-2 flex justify-center space-x-4">
              <div className="rounded-lg overflow-hidden shadow-md w-1/3">
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Luxury Hotel"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-md w-1/3 mt-8">
                <img
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Hotel Room"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-md w-1/3">
                <img
                  src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Travel Destination"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-xl md:text-2xl font-semibold mb-2 text-gray-600">How It Started</h2>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">Our Journey to Transform Travel</h3>
              <p className="text-gray-600 mb-4 leading-relaxed text-sm md:text-base">
                Horizone was founded by a team of travel enthusiasts who wanted to simplify the way people book hotels. What
                started as a small idea has grown into a global platform, connecting millions of travelers with their dream
                stays.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed text-sm md:text-base">
                With years of experience and a commitment to excellence, we’ve built a trusted community of travelers and
                hoteliers, all united by a shared love for exploration.
              </p>
            </div>
            <div className="order-1 md:order-2 rounded-lg overflow-hidden shadow-md">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Travel Journey"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-900">Why Choose Horizone</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <Globe className="h-8 w-8 mb-3 text-gray-900" />
              <h3 className="text-lg font-semibold mb-2">Global Selection</h3>
              <p className="text-gray-600 text-sm">
                Explore thousands of hotels worldwide, from boutique gems to luxury retreats.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <Search className="h-8 w-8 mb-3 text-gray-900" />
              <h3 className="text-lg font-semibold mb-2">Smart Search</h3>
              <p className="text-gray-600 text-sm">
                Filter by location, amenities, price, and more to find your ideal stay.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <Shield className="h-8 w-8 mb-3 text-gray-900" />
              <h3 className="text-lg font-semibold mb-2">Secure Booking</h3>
              <p className="text-gray-600 text-sm">
                Enjoy peace of mind with our secure payment and data protection systems.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <Building className="h-8 w-8 mb-3 text-gray-900" />
              <h3 className="text-lg font-semibold mb-2">Curated Properties</h3>
              <p className="text-gray-600 text-sm">
                Every listing is vetted for quality and accuracy, ensuring a premium experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 text-black">
        <div className="container mx-auto px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-base md:text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of travelers who trust Horizone for their next adventure.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-black text-white hover:bg-gray-800 transition-all duration-300"
            >
              <Link to="/hotels">Browse Hotels</Link>
            </Button>
             <SignedOut>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-black border-gray-600 hover:bg-gray-200 hover:text-black transition-all duration-300"
            >
              <Link to="/sign-up">Create Account</Link>
            </Button>
            </SignedOut>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;