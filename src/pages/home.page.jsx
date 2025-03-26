// pages/HomePage.jsx
import React, { useRef } from "react";
import Hero from "@/components/Hero";
import TrendingHotelListing from "@/components/TrendingHotels";
import AISearchResults from "@/components/AISearchResult";
import AboutUs from "@/components/AboutUs";

function HomePage() {
  const searchResultsRef = useRef(null);

  const handleSearchTriggered = () => {
    if (searchResultsRef.current) {
      searchResultsRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "start"
      });
    }
  };

  return (
    <main>
      <div className="relative min-h-screen">
        <Hero onSearchTriggered={handleSearchTriggered} />
        <img
          src="/assets/hero/hero_1.jpg"
          alt="hero"
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        />
      </div>
      <div ref={searchResultsRef}>
        <AISearchResults />
      </div>
      <TrendingHotelListing />
    <AboutUs/>
    </main>
  );
}

export default HomePage;