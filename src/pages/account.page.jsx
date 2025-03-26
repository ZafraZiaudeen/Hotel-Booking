import { useUser } from "@clerk/clerk-react"
import { Navigate } from "react-router"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, CalendarDays } from "lucide-react"
import { format } from "date-fns"
import BookingListing from "@/components/BookingListing"

const AccountPage = () => {
  const { isLoaded, isSignedIn, user } = useUser()

  if (!isSignedIn) {
    return <Navigate to="/sign-in" />
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">My Account</h1>
        {user && (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={user.imageUrl} alt={user.fullName} />
              <AvatarFallback>{user.fullName?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium">{user.fullName}</p>
              <p className="text-xs text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
        )}
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card className="overflow-hidden border-none shadow-md">
            <CardHeader className="bg-primary/5 pb-3">
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your account details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <h3 className="text-sm font-medium">Full Name</h3>
                    </div>
                    <p className="text-lg font-medium">{user?.fullName}</p>
                    <Separator className="my-1" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      <h3 className="text-sm font-medium">Account Created</h3>
                    </div>
                    <p className="text-lg font-medium">
                      {user?.createdAt ? format(new Date(user.createdAt), "MMMM d, yyyy") : "Unknown"}
                    </p>
                    <Separator className="my-1" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <h3 className="text-sm font-medium">Email Address</h3>
                    </div>
                    <p className="text-lg font-medium">{user?.primaryEmailAddress?.emailAddress}</p>
                    <Separator className="my-1" />
                  </div>
                </div>
              </div>
            </CardContent> 
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-10">
          <BookingListing />
        </TabsContent>
      </Tabs>
    </main>
  )
}

export default AccountPage