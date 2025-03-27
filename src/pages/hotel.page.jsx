import { useState,useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useGetHotelByIdQuery,useAddToFavoritesMutation,useRemoveFromFavoritesMutation,useGetUserFavoritesQuery} from "@/lib/api"
import { Coffee, MapPin, MenuIcon as Restaurant, Star, Tv, Wifi } from "lucide-react"
import { useParams, useNavigate } from "react-router" 
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import BookingForm from "@/components/createBookingForm"
import { useUser } from "@clerk/clerk-react" 
import { toast } from "sonner"

// Map of amenity IDs to their display components (unchanged)
const amenityComponents = {
  wifi: { icon: Wifi, label: "Free Wi-Fi" },
  restaurant: { icon: Restaurant, label: "Restaurant" },
  tv: { icon: Tv, label: "Flat-screen TV" },
  coffee: { icon: Coffee, label: "Coffee maker" },
  pool: { icon: () => <span>🏊</span>, label: "Swimming Pool" },
  spa: { icon: () => <span>💆</span>, label: "Spa" },
  gym: { icon: () => <span>🏋️</span>, label: "Fitness Center" },
  parking: { icon: () => <span>🅿️</span>, label: "Free Parking" },
  ac: { icon: () => <span>❄️</span>, label: "Air Conditioning" },
  bar: { icon: () => <span>🍸</span>, label: "Bar" },
}

export default function HotelPage() {
  const { id } = useParams()
  const navigate = useNavigate() 
  const { data: hotel, isLoading, isError } = useGetHotelByIdQuery(id)
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false)
  const { isLoaded, isSignedIn } = useUser() 
  const [addToFavorites, { isLoading: isAddingFavorite }] = useAddToFavoritesMutation()
  const [removeFromFavorites, { isLoading: isRemovingFavorite }] = useRemoveFromFavoritesMutation()
  const { data: favorites, isLoading: isFavoritesLoading, refetch } = useGetUserFavoritesQuery(undefined, {
    skip: !isSignedIn,
  });
  const [isFavorite, setIsFavorite] = useState(false);
  useEffect(() => {
    if (favorites && id) {
      const isFav = favorites.some(fav => fav._id === id)
      setIsFavorite(isFav)
    }
  }, [favorites, id])

  const handleBookingSubmit = async (bookingData) => {
    setIsBookingFormOpen(false)
  }

  const handleBookNowClick = () => {
    if (!isLoaded) return
    if (!isSignedIn) {
      navigate("/sign-in")
    } else {
      setIsBookingFormOpen(true)
    }
  }

  const handleFavoriteToggle = async () => {
    if (!isLoaded || !isSignedIn) {
      navigate("/sign-in");
      return;
    }

    try {
      if (isFavorite) {
        await removeFromFavorites(id).unwrap();
        setIsFavorite(false);
        toast.success("Hotel removed from favorites!");
      } else {
        await addToFavorites(id).unwrap();
        setIsFavorite(true);
        toast.success("Hotel added to favorites!");
      }
      
      refetch();
    } catch (error) {
      toast.error(`Failed to ${isFavorite ? 'remove' : 'add'} hotel ${isFavorite ? 'from' : 'to'} favorites`);
    }
  };

  if (isLoading || isFavoritesLoading)
    return (
     
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="w-full h-[400px] rounded-lg" />
            <div className="flex space-x-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
            <Skeleton className="h-4 w-36" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Card>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="flex items-center">
                      <Skeleton className="h-5 w-5 mr-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-8 w-24 mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>
      </div>
    )

  if (isError) return <p className="text-red">Error loading hotel data</p>

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative w-full h-[400px]">
            <img
              src={hotel.image || "/placeholder.svg"}
              alt={hotel.name}
              className="absolute object-cover rounded-lg w-full h-full"
            />
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{hotel.name}</h1>
              <div className="flex items-center mt-2">
                <MapPin className="h-5 w-5 text-muted-foreground mr-1" />
                <p className="text-muted-foreground">{hotel.location}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleFavoriteToggle}
              disabled={isAddingFavorite || isRemovingFavorite}
            >
              <Star 
                className={`h-4 w-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`}
              />
              <span className="sr-only">
                {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              </span>
            </Button>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-5 w-5 fill-primary text-primary" />
            <span className="font-bold">{hotel.rating ?? "No rating"}</span>
            <span className="text-muted-foreground">({hotel.reviews?.toLocaleString() ?? "No"} reviews)</span>
          </div>
          <p className="text-muted-foreground">{hotel.description}</p>
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 gap-4">
                {hotel.amenities && hotel.amenities.length > 0 ? (
                  hotel.amenities.map((amenityId) => {
                    const amenity = amenityComponents[amenityId]
                    if (!amenity) return null
                    const Icon = amenity.icon
                    return (
                      <div key={amenityId} className="flex items-center">
                        {typeof Icon === "function" ? (
                          <span className="mr-2 text-xl">
                            <Icon />
                          </span>
                        ) : (
                          <Icon className="h-5 w-5 mr-2" />
                        )}
                        <span>{amenity.label}</span>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-muted-foreground">No amenities listed</p>
                )}
              </div>
            </CardContent>
          </Card>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Room Types</h2>
            {hotel.rooms && hotel.rooms.length > 0 ? (
              <div className="space-y-2">
                {hotel.rooms.map((room, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="font-medium">{room.type}</span>
                    <span className="text-xl font-bold">
                      ${room.price} <span className="text-sm text-muted-foreground">/ night</span>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No room types available</p>
            )}
            <Button size="lg" onClick={handleBookNowClick} className="w-full mt-4">
          Book Now
        </Button>
          </div>
        </div>
      </div>

      <Dialog open={isBookingFormOpen} onOpenChange={setIsBookingFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Book Your Stay</DialogTitle>
            <DialogDescription>Complete the form below to book your stay at {hotel?.name}</DialogDescription>
          </DialogHeader>
          <BookingForm
            hotel={hotel}
            onSubmit={handleBookingSubmit} 
            isLoading={false} 
            onBookingSuccess={() => setIsBookingFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}