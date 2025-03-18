import HotelCard from "./HotelCard";
import LocationTab from "./LocationTab";
import { useState } from "react";
import { useGetHotelsQuery } from "@/lib/api";

export default function HotelListing() {
 const{data:hotels,isLoading,isError,error} = useGetHotelsQuery();
   
  const locations = [
        "All","France", "Australia", "Japan", "Italy"
    ]

    const [selectedLocation,setSelectedLocation] = useState("All");

    const handleSelectedLocation = (location) => {
        setSelectedLocation(location);
    }
    const filteredHotels = selectedLocation === "All"
    ? hotels
    : hotels.filter((hotel) => {
        return hotel.location.toLowerCase().includes(selectedLocation.toLowerCase());
    });


if(isLoading){
    return (
        <section className="px-8 py-8 lg:py-16">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Top trending hotels worldwide
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover the most trending hotels worldwide for an unforgettable
              experience.
            </p>
          </div>
          <div className="flex items-center gap-x-4">
            {locations.map((location, i) => {
              return (
                <LocationTab
                  key={i}
                  selectedLocation={selectedLocation}
                  name={location}
                  onClick={handleSelectedLocation}
                />
              );
            })}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
            <p>Loading...</p>
          </div>
        </section>
      );
}
if(isError){
    return (
        <section className="px-8 py-8 lg:py-16">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Top trending hotels worldwide
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover the most trending hotels worldwide for an unforgettable
              experience.
            </p>
          </div>
          <div className="flex items-center gap-x-4">
            {locations.map((location, i) => {
              return (
                <LocationTab
                  key={i}
                  selectedLocation={selectedLocation}
                  name={location}
                  onClick={handleSelectedLocation}
                />
              );
            })}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
            <p className="text-red-500">{error}</p>
          </div>
        </section>
      );
}
    return (
        <section className="px-8 py-8 lg:py-16">
            <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Top trending hotels worldwide
                </h2>
               
                <p className="text-lg text-muted-foreground">
                    Discover the most trending hotels worldwide for an unforgettable experience.
                </p>
            </div>

            <div className="flex items-center gap-x-4 mt-4 ">
                {locations.map((location,i) => {
                    return <LocationTab 
                    key={i}
                    selectedLocation={selectedLocation} 
                    name={location} 
                    onClick={handleSelectedLocation}/>;
                })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
            {filteredHotels.map((hotel) => {
          return <HotelCard key={hotel._id} hotel={hotel} />;
        })}
            </div>
        </section>
    );
}
