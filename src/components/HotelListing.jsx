import { useSelector, useDispatch } from "react-redux";
import { useGetHotelsQuery, useGetHotelLocationsQuery } from "@/lib/api";
import { setLocation, setSortByPrice, clearFilters } from "@/lib/features/filterSlice";
import HotelCard from "./HotelCard";
import LocationTab from "./LocationTab";
import { Skeleton } from "@/components/ui/skeleton";

export default function HotelListing() {
  // Get the selected location and sortByPrice from the Redux store
  const { selectedLocation, sortByPrice } = useSelector((state) => state.filter);
  const dispatch = useDispatch();

  // Fetch hotels with the current filters
  const {
    data: hotels,
    isLoading: isHotelsLoading,
    isError: isHotelsError,
    error: hotelsError,
  } = useGetHotelsQuery({
    location: selectedLocation === "ALL" ? "" : selectedLocation,
    sortByPrice,
  });

  // Fetch unique countries
  const {
    data: countries,
    isLoading: isCountriesLoading,
    isError: isCountriesError,
    error: countriesError,
  } = useGetHotelLocationsQuery();

  // Combine "ALL" with the fetched countries
  const locations = countries ? ["ALL", ...countries] : ["ALL"];

  // Handle location selection
  const handleSelectedLocation = (location) => {
    if (location === "ALL") {
      dispatch(clearFilters()); 
    } else {
      dispatch(setLocation(location));
    }
  };

  // Handle sorting selection
  const handleSortChange = (e) => {
    dispatch(setSortByPrice(e.target.value));
  };

  if (isHotelsLoading || isCountriesLoading) {
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
              selectedLocation={selectedLocation || "ALL"}
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

  if (isHotelsError || isCountriesError) {
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
              selectedLocation={selectedLocation || "ALL"}
              name={location}
              onClick={handleSelectedLocation}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
          <p className="text-red-500">
            {hotelsError?.data?.message || countriesError?.data?.message || "An error occurred"}
          </p>
        </div>
      </section>
    );
  }

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
      <div className="flex items-center justify-between mb-4">
        {/* Location Tabs */}
        <div className="flex items-center gap-x-4">
          {locations.map((location, i) => (
            <LocationTab
              key={i}
              selectedLocation={selectedLocation || "ALL"}
              name={location}
              onClick={handleSelectedLocation}
            />
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div>
          <label htmlFor="sort" className="mr-2">
            Sort by Price:
          </label>
          <select
            id="sort"
            value={sortByPrice}
            onChange={handleSortChange}
            className="border rounded px-2 py-1"
          >
            <option value="">Default</option>
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
        {hotels && hotels.length > 0 ? (
          hotels.map((hotel) => <HotelCard key={hotel._id} hotel={hotel} />)
        ) : (
          <p>No hotels found for the selected location.</p>
        )}
      </div>
    </section>
  );
}