import { Button } from "@/components/ui/button";
import { useGetCheckoutSessionStatusQuery } from "@/lib/api";
import { Link, useSearchParams, Navigate } from "react-router-dom";
import { format } from "date-fns";

function CompletePage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return <Navigate to="/" />;
  }

  const { data, isLoading, isError } = useGetCheckoutSessionStatusQuery(sessionId);

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <section className="max-w-3xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>
            <div className="border rounded-lg overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4 bg-gray-50">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
            <div className="mt-6 border-t pt-4">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i}>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 border-t pt-4">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">
            Something went wrong
          </h2>
          <p className="mb-4 text-gray-600">
            We couldn't process your payment information. Please try again or
            contact support.
          </p>
          <Button asChild className="mt-6">
            <Link to={`/booking/payment?bookingId=${data?.bookingId || ""}`}>
              Return to Payment Page
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  if (data?.status === "open") {
    return <Navigate to={`/booking/payment?bookingId=${data?.bookingId}`} />;
  }

  if (data?.status === "complete") {
    const checkInDate = new Date(data.booking.checkIn);
    const checkOutDate = new Date(data.booking.checkOut);
    const formattedCheckIn = format(checkInDate, "MMM dd, yyyy");
    const formattedCheckOut = format(checkOutDate, "MMM dd, yyyy");

    const nights = Math.round(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
      <main className="container mx-auto px-4 py-8">
        <section
          id="success"
          className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md"
        >
          <div className="flex justify-center mb-4 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-center">
            Booking Confirmed!
          </h2>
          <p className="text-center mb-4 text-gray-600">
            Your payment has been processed successfully.
          </p>

          <div className="mt-6 border rounded-lg overflow-hidden">
            <div className="relative h-48">
              {data.hotel.image && (
                <img
                  src={data.hotel.image}
                  alt={data.hotel.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="p-4 bg-gray-50">
              <h3 className="text-xl font-bold">{data.hotel.name}</h3>
              <p className="text-gray-600 mb-2">{data.hotel.location}</p>
              {data.hotel.rating && (
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span>{data.hotel.rating.toFixed(1)}</span>
                  {data.hotel.reviews && (
                    <span className="text-gray-500 text-sm ml-1">
                      ({data.hotel.reviews} reviews)
                    </span>
                  )}
                </div>
              )}
              {data.hotel.amenities && (
                <p className="text-gray-600 text-sm">
                  Amenities: {data.hotel.amenities.join(", ")}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Booking Details:</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Booking ID</p>
                  <p className="font-medium">
                    {data.booking._id || data.bookingId}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Room Assignments</p>
                  <p className="font-medium">
                    {data.booking.roomAssignments
                      ?.map((ra) => `${ra.roomType} (${ra.roomNumbers.join(", ")})`)
                      .join(", ") || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Check-in Date</p>
                  <p className="font-medium">{formattedCheckIn}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Check-out Date</p>
                  <p className="font-medium">{formattedCheckOut}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Duration</p>
                  <p className="font-medium">
                    {nights} {nights === 1 ? "night" : "nights"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Payment Status</p>
                  <p className="font-medium text-green-600">
                    {data.booking.paymentStatus}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Payment Method</p>
                  <p className="font-medium">{data.booking.paymentMethod}</p>
                </div>
                {data.booking.specialRequests && (
                  <div>
                    <p className="text-gray-600 text-sm">Special Requests</p>
                    <p className="font-medium">{data.booking.specialRequests}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">What happens next?</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Present your booking ID upon arrival at the hotel</li>
              <li>Check-in time starts at 2:00 PM on {formattedCheckIn}</li>
              <li>Check-out time is before 12:00 PM on {formattedCheckOut}</li>
              {data.booking.specialRequests && (
                <li>
                  Your special requests have been noted and will be accommodated
                  where possible
                </li>
              )}
            </ul>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              If you have any questions, please contact{" "}
              <a
                href="mailto:bookings@example.com"
                className="text-blue-600 hover:underline"
              >
                bookings@example.com
              </a>
            </p>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <Button asChild variant="outline">
              <Link to="/">Return to Home</Link>
            </Button>
            <Button asChild>
              <Link to="/bookings">View All Bookings</Link>
            </Button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Payment Status Unknown</h2>
        <p className="mb-4 text-gray-600">
          We couldn't determine the status of your payment. If you completed a
          booking, please check your email for confirmation.
        </p>
        <Button asChild className="mt-6">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </main>
  );
}

export default CompletePage;