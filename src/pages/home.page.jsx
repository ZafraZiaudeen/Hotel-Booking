import React from "react";
import Hero from "@/components/Hero";
import HotelListing from "@/components/HotelListing";

function HomePage() {
    return (
        <main>
            <div className="relative min-h-screen">
                <Hero />
                <img
                    src="/assets/hero/hero_1.jpg"
                    alt="hero"
                    className="absolute top-0 left-0 w-full h-full object-cover -z-10"
                />
            </div>
            <HotelListing />
            </main>
    )
}
export default HomePage;