import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import HotelListing from "@/components/HotelListing";
function App() {
  
  return (
   <>
    <Navigation name="Zafra" />
    <div className="relave min-h-screen">
    <Hero />
    <img
      src="/assets/hero/hero_1.jpg"
      alt="hero"
      className="absolute top-0 left-0 w-full h-full object-cover -z-10"
    />
    </div>
    <HotelListing />
   </>
  );
}

export default App;