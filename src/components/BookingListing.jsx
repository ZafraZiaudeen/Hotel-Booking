import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Hotel, MapPin, AlertCircle, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import {
  useGetBookingsForUserQuery,
  useCancelBookingMutation,
} from "@/lib/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

const BookingListing = () => {
  const {
    data: bookings,
    error,
    isLoading,
  } = useGetBookingsForUserQuery();
  const [cancelBooking] = useCancelBookingMutation();
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const handleCancelBooking = async () => {
    if (bookingToCancel && !isCancelling) {
      setIsCancelling(true);
      try {
        const toastId = toast.loading("Cancelling booking...");
        await cancelBooking(bookingToCancel._id).unwrap();
        toast.success("Booking cancelled successfully", { id: toastId });
        setCancelDialogOpen(false);
        setBookingToCancel(null);
      } catch (err) {
        console.error("Cancellation failed:", err);
        toast.error(
          err?.data?.message || "Failed to cancel booking. Please try again."
        );
      } finally {
        setIsCancelling(false);
      }
    }
  };

  const openCancelDialog = (booking) => {
    setBookingToCancel(booking);
    setCancelDialogOpen(true);
  };

  const canCancelBooking = (booking) => {
    if (booking.status !== "ongoing") return false;

    const currentTime = new Date();
    const creationTime = new Date(booking.createdAt);
    const checkInDate = new Date(booking.checkIn);

    const today = new Date(currentTime);
    today.setHours(0, 0, 0, 0);
    const checkInDay = new Date(checkInDate);
    checkInDay.setHours(0, 0, 0, 0);

    const hoursSinceCreation = (currentTime.getTime() - creationTime.getTime()) / (1000 * 60 * 60);
    const minutesSinceCreation = (currentTime.getTime() - creationTime.getTime()) / (1000 * 60);

    const isCheckInToday = today.getTime() === checkInDay.getTime();
    const isWithin48HoursOfCreation = hoursSinceCreation <= 48;

    if (isCheckInToday || isWithin48HoursOfCreation) {
      return minutesSinceCreation <= 30;
    } else {
      return hoursSinceCreation <= 48;
    }
  };

  // Filter bookings based on search query
  const filterBookings = (bookings) => {
    if (!searchQuery) return bookings;
    const query = searchQuery.toLowerCase();
    return bookings.filter(
      (booking) =>
        booking.hotelName.toLowerCase().includes(query) ||
        booking.location.toLowerCase().includes(query)
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-12">
        <div className="mb-6">
          <Skeleton className="h-10 w-64" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="grid gap-6">
            {[...Array(2)].map((_, index) => (
              <SkeletonBookingCard key={index} />
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="grid gap-6">
            {[...Array(2)].map((_, index) => (
              <SkeletonBookingCard key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    if (
      error?.status === 404 ||
      error?.data?.name === "NotFoundError" ||
      error?.message?.includes("No bookings found for this user") ||
      error?.data?.message?.includes("No bookings found for this user")
    ) {
      return (
        <Card className="bg-muted/50">
          <div className="mb-6">
            <Skeleton className="h-10 w-64" />
          </div>
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <Hotel className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Bookings Yet</h3>
            <p className="text-muted-foreground max-w-md">
              It looks like you haven’t made any bookings yet. Ready to plan your next getaway? Book a hotel now and start your adventure!
            </p>
            <Button className="mt-6" variant="outline" asChild>
              <a href="/hotels">Book a Hotel</a>
            </Button>
          </CardContent>
        </Card>
      );
    }

    return <div>Error loading bookings: {error.message || "An unexpected error occurred"}</div>;
  }

  const upcomingBookings = filterBookings(
    bookings.filter((booking) => booking.status === "ongoing")
  );
  const pastBookings = filterBookings(
    bookings.filter((booking) => booking.status === "completed" || booking.status === "cancelled")
  );

  return (
    <>
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by hotel name or location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-semibold">Upcoming Bookings</h2>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {upcomingBookings.length}{" "}
            {upcomingBookings.length === 1 ? "Booking" : "Bookings"}
          </Badge>
        </div>
        {upcomingBookings.length > 0 ? (
          <div className="grid gap-6">
            {upcomingBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onCancel={() => openCancelDialog(booking)}
                showCancelButton={canCancelBooking(booking)}
              />
            ))}
          </div>
        ) : (
          <Card className="bg-muted/50">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchQuery ? "No Matching Upcoming Bookings" : "No Upcoming Bookings"}
              </h3>
              <p className="text-muted-foreground max-w-md">
                {searchQuery
                  ? "No upcoming bookings match your search. Try a different hotel name or location."
                  : "You don’t have any upcoming bookings. When you book a hotel, your reservations will appear here."}
              </p>
              {!searchQuery && (
                <Button className="mt-6" variant="outline" asChild>
                  <a href="/hotels">Browse Hotels</a>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-semibold">Past Bookings</h2>
          <Badge variant="outline" className="bg-muted text-muted-foreground">
            {pastBookings.length}{" "}
            {pastBookings.length === 1 ? "Booking" : "Bookings"}
          </Badge>
        </div>
        {pastBookings.length > 0 ? (
          <div className="grid gap-6">
            {pastBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                showCancelButton={false}
              />
            ))}
          </div>
        ) : (
          <Card className="bg-muted/50">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchQuery ? "No Matching Past Bookings" : "No Past Bookings"}
              </h3>
              <p className="text-muted-foreground max-w-md">
                {searchQuery
                  ? "No past bookings match your search. Try a different hotel name or location."
                  : "You don’t have any past bookings. After your stays, your booking history will appear here."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your booking at {bookingToCancel?.hotelName}?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {bookingToCancel && (
              <div className="bg-muted p-4 rounded-md space-y-2">
                <div className="flex items-center gap-2">
                  <Hotel className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{bookingToCancel.hotelName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p>
                    {format(new Date(bookingToCancel.checkIn), "MMM d, yyyy")} -{" "}
                    {format(new Date(bookingToCancel.checkOut), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p>
                    {bookingToCancel.roomAssignments
                      .map((ra) => ra.roomType)
                      .join(", ")}
                  </p>
                </div>
              </div>
            )}
            <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-700">
                {bookingToCancel && new Date(bookingToCancel.checkIn).toDateString() === new Date().toDateString()
                  ? "Cancellation is only allowed within 30 minutes of booking creation for bookings on the current date."
                  : bookingToCancel && (new Date() - new Date(bookingToCancel.createdAt)) / (1000 * 60 * 60) <= 48
                  ? "Cancellation is only allowed within 30 minutes of booking creation for bookings created within 48 hours."
                  : "Cancellation is only allowed within 48 hours of booking creation."}
              </p>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              className="sm:flex-1"
            >
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelBooking}
              className="sm:flex-1"
              disabled={isCancelling}
            >
              {isCancelling ? "Cancelling..." : "Cancel Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
const BookingCard = ({ booking, onCancel, showCancelButton }) => {
  const navigate = useNavigate();
  const nights = Math.round(
    (new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24)
  );

  const totalPrice = booking.roomAssignments.reduce((sum, ra) => {
    const pricePerNight = ra.price || 0;
    const numRooms = ra.roomNumbers.length;
    return sum + pricePerNight * numRooms * nights;
  }, 0);

  const handleBookAgain = () => {
    navigate(`/hotels/${booking.hotelId}`);
  };

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 lg:w-1/4 h-[180px] md:h-auto relative">
            <img
              src={booking.image || "/placeholder.svg?height=100&width=200"}
              alt={booking.hotelName}
              className="w-full h-full object-cover"
            />
            <Badge
              className={`absolute top-3 right-3 ${
                booking.status === "ongoing"
                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                  : booking.status === "completed"
                  ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                  : "bg-red-100 text-red-800 hover:bg-red-100"
              }`}
            >
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
          </div>
          <div className="p-5 md:p-6 flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">{booking.hotelName}</h3>
                  <div className="flex items-center text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{booking.location}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Check-in</p>
                      <p>{format(new Date(booking.checkIn), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Check-out</p>
                      <p>{format(new Date(booking.checkOut), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Duration</p>
                      <p>
                        {nights} {nights === 1 ? "night" : "nights"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Hotel className="h-4 w-4 mr-2 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Rooms</p>
                      {booking.roomAssignments.map((ra, index) => (
                        <div key={index} className="mt-1">
                          <p className="text-sm">
                            {ra.roomType} (Room{ra.roomNumbers.length > 1 ? "s" : ""}: {ra.roomNumbers.join(", ")})
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Payment Status</p>
                      <p className={`text-sm capitalize ${
                        booking.paymentStatus === "completed" ? "text-green-600" :
                        booking.paymentStatus === "failed" ? "text-red-600" : "text-yellow-600"
                      }`}>
                        {booking.paymentStatus}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end mt-4 md:mt-0">
                <div className="bg-primary/5 px-4 py-3 rounded-lg text-center md:text-right w-full md:w-auto">
                  <p className="text-2xl font-bold">${totalPrice.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    Total for {nights} {nights === 1 ? "night" : "nights"}
                  </p>
                </div>

                {showCancelButton && (
                  <Button
                    variant="outline"
                    className="mt-4 text-destructive hover:text-destructive hover:bg-destructive/10 w-full md:w-auto"
                    onClick={onCancel}
                  >
                    Cancel Booking
                  </Button>
                )}

                {!showCancelButton && booking.status === "completed" && (
                  <Button
                    variant="outline"
                    className="mt-4 w-full md:w-auto"
                    onClick={handleBookAgain}
                  >
                    Book Again
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SkeletonBookingCard = () => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <Skeleton className="w-full md:w-1/3 lg:w-1/4 h-[180px]" />
          <div className="p-5 md:p-6 flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="space-y-4 w-full">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
              <div className="flex flex-col items-start md:items-end mt-4 md:mt-0 space-y-4">
                <Skeleton className="h-16 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingListing;