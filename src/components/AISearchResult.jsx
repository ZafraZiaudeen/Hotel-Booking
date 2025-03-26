import HotelCard from "./HotelCard";
import { useGetHotelsForSearchQueryQuery } from "@/lib/api";
import { useSelector } from "react-redux";

export default function AISearchResults() {
  const searchValue = useSelector((state) => state.search.value);

  const {
    data: hotels,
    isLoading,
    isFetching, // Add isFetching to track ongoing requests
    isError,
    error,
  } = useGetHotelsForSearchQueryQuery({
    query: searchValue,
  });

  if (!searchValue) return null;

  // Show "Loading..." if the query is initially loading or refetching
  if (isLoading || isFetching) {
    return (
      <section className="px-8 py-8 lg:py-16">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Search Results
          </h2>
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="px-8 py-8 lg:py-16">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Search Results
          </h2>
          <p className="text-red-500">{error?.message || "An error occurred"}</p>
        </div>
      </section>
    );
  }

  if (!hotels || hotels.length === 0) {
    return (
      <section className="px-8 py-8 lg:py-16">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Search Results
          </h2>
          <p>No hotels found matching your search.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-8 py-8 lg:py-16">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Search Results for "{searchValue}"
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {hotels.map(({ hotel, confidence }) => (
          <HotelCard key={hotel._id} hotel={hotel} confidence={confidence} />
        ))}
      </div>
    </section>
  );
}