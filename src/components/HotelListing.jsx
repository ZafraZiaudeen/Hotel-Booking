import HotelCard from "./HotelCard";
import LocationTab from "./LocationTab";
import { useState } from "react";
import { useGetHotelsQuery } from "@/lib/api"; 
import { useSelector } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";

export default function HotelListing() {
  const {
    data: hotels,
    isLoading,
    isError,
    error,
  } = useGetHotelsQuery(); 

  const locations = ["ALL", "France", "Italy", "Australia", "Japan"];
  const [selectedLocation, setSelectedLocation] = useState("ALL");

  const handleSelectedLocation = (location) => {
    setSelectedLocation(location);
  };

  if (isLoading) {
    return (
      <section className="px-8 py-8 lg:py-16">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore Hotels Worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover hotels across the globe for your perfect stay.
          </p>
        </div>
        <div className="flex items-center gap-x-4">
          {locations.map((location, i) => (
            <LocationTab
              key={i}
              selectedLocation={selectedLocation}
              name={location}
              onClick={handleSelectedLocation}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="space-y-4">
              <Skeleton className="w-full h-[200px] rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="px-8 py-8 lg:py-16">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore Hotels Worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover hotels across the globe for your perfect stay.
          </p>
        </div>
        <div className="flex items-center gap-x-4">
          {locations.map((location, i) => (
            <LocationTab
              key={i}
              selectedLocation={selectedLocation}
              name={location}
              onClick={handleSelectedLocation}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
          <p className="text-red-500">{error.message || "An error occurred"}</p>
        </div>
      </section>
    );
  }

  const filteredHotels =
    selectedLocation === "ALL"
      ? hotels
      : hotels.filter((hotel) => 
          hotel.location
            .toLowerCase()
            .includes(selectedLocation.toLowerCase())
        );

  return (
    <section className="px-8 py-8 lg:py-16">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Explore Hotels Worldwide
        </h2>
        <p className="text-lg text-muted-foreground">
          Discover hotels across the globe for your perfect stay.
        </p>
      </div>
      <div className="flex items-center gap-x-4">
        {locations.map((location, i) => (
          <LocationTab
            key={i}
            selectedLocation={selectedLocation}
            name={location}
            onClick={handleSelectedLocation}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
        {filteredHotels.map((hotel) => (
          <HotelCard key={hotel._id} hotel={hotel} /> 
        ))}
      </div>
    </section>
  );
}