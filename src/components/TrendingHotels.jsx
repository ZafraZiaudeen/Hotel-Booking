import HotelCard from "./HotelCard";
import { useGetTopTrendingHotelsQuery } from "@/lib/api"; 

export default function TrendingHotelListing() {
  const {
    data: trendingHotels,
    isLoading,
    isError,
    error,
  } = useGetTopTrendingHotelsQuery(); // Fetch trending hotels

  if (isLoading) {
    return (
      <section className="px-8 py-8 lg:py-16">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trending Hotels Right Now
          </h2>
          <p className="text-lg text-muted-foreground">
            Check out the most popular hotels based on recent bookings.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
          <p>Loading trending hotels...</p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="px-8 py-8 lg:py-16">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trending Hotels Right Now
          </h2>
          <p className="text-lg text-muted-foreground">
            Check out the most popular hotels based on recent bookings.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
          <p className="text-red-500">{error.message || "An error occurred while fetching trending hotels"}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-8 py-8 lg:py-16">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Trending Hotels Right Now
        </h2>
        <p className="text-lg text-muted-foreground">
          Check out the most popular hotels based on recent bookings.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
        {trendingHotels.map((hotel) => (
          <HotelCard key={hotel._id} hotel={hotel} />
        ))}
      </div>
    </section>
  );
}