import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useGetUserFavoritesQuery } from "@/lib/api";
import { useUser } from "@clerk/clerk-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import HotelCard from "@/components/HotelCard";
import { Heart } from "lucide-react";

export default function FavouritePage() {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const { data: favorites = [], isLoading, isError, error } = useGetUserFavoritesQuery(undefined, {
    skip: !isSignedIn,
  });

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/sign-in");
    }
  }, [isSignedIn, navigate]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Favorites</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="w-full">
              <CardContent className="p-4">
                <Skeleton className="h-40 w-full rounded-lg mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    console.log("Error object:", error);

    // Check for 404 or NotFoundError specifically (no toast here)
    if (
      error?.status === 404 ||
      error?.data?.name === "NotFoundError" ||
      error?.message?.includes("No favorites found for this user") ||
      error?.data?.message?.includes("No favorites found for this user")
    ) {
      return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Your Favorites</h1>
          <Card className="bg-muted/50">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <Heart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Favorites Yet</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                It looks like you haven’t saved any favorites yet. Explore our amazing hotels and add your top picks to your favorites list!
              </p>
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <a href="/hotels">
                  <Heart className="h-4 w-4 mr-2" />
                  Find Hotels to Favorite
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Generic error state for non-404 errors (show toast here)
    toast.error("Error loading favorites");
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Favorites</h1>
        <Card className="bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <Heart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Unable to Load Favorites</h3>
            <p className="text-muted-foreground max-w-md">
              Something went wrong while fetching your favorite hotels. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If favorites exist and no error
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Favorites</h1>
      {favorites.length === 0 ? (
        <Card className="bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <Heart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Favorites Yet</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              It looks like you haven’t saved any favorites yet. Explore our amazing hotels and add your top picks to your favorites list!
            </p>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <a href="/hotels">
                <Heart className="h-4 w-4 mr-2" />
                Find Hotels to Favorite
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((hotel) => (
            <HotelCard key={hotel._id} hotel={hotel} />
          ))}
        </div>
      )}
    </div>
  );
}