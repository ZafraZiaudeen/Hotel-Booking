import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { useState } from "react"
import { Check, Wifi, Tv, Coffee, Utensils, Star, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { useCreateHotelMutation } from "@/lib/api"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

const amenitiesList = [
  { id: "wifi", label: "Free Wi-Fi", icon: Wifi },
  { id: "tv", label: "Flat-screen TV", icon: Tv },
  { id: "restaurant", label: "Restaurant", icon: Utensils },
  { id: "coffee", label: "Coffee maker", icon: Coffee },
  { id: "pool", label: "Swimming Pool", icon: "🏊" },
  { id: "spa", label: "Spa", icon: "💆" },
  { id: "gym", label: "Fitness Center", icon: "🏋️" },
  { id: "parking", label: "Free Parking", icon: "🅿️" },
  { id: "ac", label: "Air Conditioning", icon: "❄️" },
  { id: "bar", label: "Bar", icon: "🍸" },
]

// Updated room schema with from/to instead of count
const roomSchema = z.object({
  type: z.string().min(1, "Room type is required"),
  from: z.preprocess(
    (val) => Number(val) || 0,
    z.number().min(1, "Starting room number must be at least 1")
  ),
  to: z.preprocess(
    (val) => Number(val) || 0,
    z.number().min(1, "Ending room number must be at least 1")
  ),
  price: z.preprocess(
    (val) => Number(val) || 0,
    z.number().min(1, "Price must be greater than 0")
  ),
}).refine((data) => data.to >= data.from, {
  message: "Ending room number must be greater than or equal to starting room number",
  path: ["to"],
});

const formSchema = z.object({
  name: z.string().min(1, "Hotel name is required"),
  location: z.string().min(1, "Location is required"),
  image: z.string().min(1, "Image URL is required"),
  description: z.string().min(1, "Description is required"),
  rating: z.preprocess(
    (val) => Number(val) || 0,
    z.number().min(0, "Rating must be at least 0").max(5, "Rating must be at most 5")
  ),
  reviews: z.preprocess(
    (val) => Number(val) || 0,
    z.number().min(0, "Review count must be at least 0")
  ),
  amenities: z.array(z.string()).min(1, "Select at least one amenity"),
  rooms: z.array(roomSchema).min(1, "At least one room type is required"),
})

const CreateHotelForm = () => {
  const [createHotel, { isLoading }] = useCreateHotelMutation()
  const [activeTab, setActiveTab] = useState("basic")

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      image: "",
      description: "",
      rating: 0,
      reviews: 0,
      amenities: [],
      rooms: [{ type: "", from: 101, to: 101, price: 0 }], 
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rooms",
  })

  const addRoomType = () => {
    append({ type: "", from: 101, to: 101, price: 0 }) 
  }

  const handleSubmit = async (values) => {
    try {
      const formData = {
        ...values,
      }
  
      const toastId = toast.loading("Creating hotel...");
  
      const timeout = setTimeout(() => {
        toast.dismiss(toastId);
      }, 3000);
  
      await createHotel(formData).unwrap();
      
  
      clearTimeout(timeout);
      toast.success("Hotel created successfully", {
        id: toastId,
      });
      
      form.reset();
      setActiveTab("basic");
    } catch (error) {
      toast.error("Failed to create hotel");
    }
  };

  const nextTab = () => {
    if (activeTab === "basic") {
      form.trigger(["name", "location", "image", "description"]).then((isValid) => {
        if (isValid) setActiveTab("rooms")
      })
    } else if (activeTab === "rooms") {
      form.trigger(["rooms"]).then((isValid) => {
        if (isValid) setActiveTab("details")
      })
    }
  }

  const prevTab = () => {
    if (activeTab === "rooms") setActiveTab("basic")
    if (activeTab === "details") setActiveTab("rooms")
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
        <CardTitle className="text-2xl">Create New Hotel </CardTitle>
        <CardDescription className="text-slate-200">Fill in the details to create a new hotel</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="rooms">Room Types</TabsTrigger>
              <TabsTrigger value="details">Details & Amenities</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="mt-0">
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hotel Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Montmartre Majesty Hotel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Paris, France" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/hotel-image.jpg" {...field} />
                      </FormControl>
                      <FormDescription>Provide a URL to a high-quality image of the hotel</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Stay in the heart of Paris, France, at the Montmartre Majesty Hotel..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a detailed description of the hotel and its surroundings
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-end border-t p-4">
                <Button type="button" onClick={nextTab}>
                  Next: Room Types
                </Button>
              </CardFooter>
            </TabsContent>

            <TabsContent value="rooms" className="mt-0">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Room Types & Pricing</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addRoomType} disabled={fields.length >= 6}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Room Type
                  </Button>
                </div>

                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-6">
                    {fields.map((field, index) => (
                      <Card key={field.id} className="p-4 border">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center w-full space-x-4">
                            <FormField
                              control={form.control}
                              name={`rooms.${index}.type`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel>Room Type</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="e.g., Deluxe King"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`rooms.${index}.from`}
                              render={({ field }) => (
                                <FormItem className="w-24">
                                  <FormLabel>From</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="1"
                                      onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                                      value={field.value}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`rooms.${index}.to`}
                              render={({ field }) => (
                                <FormItem className="w-24">
                                  <FormLabel>To</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="1"
                                      onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                                      value={field.value}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(index)}
                              className="text-destructive hover:text-destructive/90"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="mt-4">
                          <FormField
                            control={form.control}
                            name={`rooms.${index}.price`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price ($)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="1"
                                    onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                                    value={field.value}
                                  />
                                </FormControl>
                                <FormDescription>Price per night for this room type</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                <Button type="button" variant="outline" onClick={prevTab}>
                  Back
                </Button>
                <Button type="button" onClick={nextTab}>
                  Next: Details & Amenities
                </Button>
              </CardFooter>
            </TabsContent>

            <TabsContent value="details" className="mt-0">
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating (0-5)</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              step="0.1"
                              min="0"
                              max="5"
                              placeholder="4.7"
                              onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                              value={field.value}
                            />
                            <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reviews"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Reviews</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="2578"
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator className="my-4" />

                <FormField
                  control={form.control}
                  name="amenities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amenities</FormLabel>
                      <FormDescription>Select all amenities available at the hotel</FormDescription>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                        {amenitiesList.map((amenity) => (
                          <div
                            key={amenity.id}
                            className={`flex items-center space-x-2 border rounded-md p-3 cursor-pointer transition-colors ${
                              field.value.includes(amenity.id)
                                ? "border-primary bg-primary/5"
                                : "border-input hover:bg-muted/50"
                            }`}
                            onClick={() => {
                              const updatedValue = field.value.includes(amenity.id)
                                ? field.value.filter((id) => id !== amenity.id)
                                : [...field.value, amenity.id]
                              field.onChange(updatedValue)
                            }}
                          >
                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                              {typeof amenity.icon === "string" ? (
                                <span className="text-xl">{amenity.icon}</span>
                              ) : (
                                <amenity.icon className="h-5 w-5" />
                              )}
                            </div>
                            <div className="flex-grow">{amenity.label}</div>
                            {field.value.includes(amenity.id) && <Check className="h-4 w-4 text-primary" />}
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                <Button type="button" variant="outline" onClick={prevTab}>
                  Back
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Hotel"}
                </Button>
              </CardFooter>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </Card>
  )
}

export default CreateHotelForm;