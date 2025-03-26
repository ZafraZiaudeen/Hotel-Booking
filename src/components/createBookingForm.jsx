import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import {
  useCreateBookingMutation,
  useGetRoomAvailabilityQuery,
} from "@/lib/api";
import { toast } from "sonner";

const roomSelectionSchema = z.object({
  roomType: z.string({ required_error: "Please select a room type" }),
  numRooms: z.coerce
    .number()
    .int()
    .min(1, { message: "At least 1 room is required" })
    .max(10, { message: "Maximum 10 rooms allowed" }),
});

const formSchema = z
  .object({
    checkIn: z.date({ required_error: "Check-in date is required" }),
    checkOut: z.date({ required_error: "Check-out date is required" }),
    roomSelections: z
      .array(roomSelectionSchema)
      .min(1, { message: "At least one room must be selected" }),
    specialRequests: z.string().optional(),
  })
  .refine(
    (data) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return data.checkIn >= today;
    },
    { message: "Check-in date must be today or in the future", path: ["checkIn"] }
  )
  .refine(
    (data) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return data.checkOut > today;
    },
    { message: "Check-out date must be in the future", path: ["checkOut"] }
  )
  .refine((data) => data.checkOut > data.checkIn, {
    message: "Check-out date must be after check-in date",
    path: ["checkOut"],
  })
  .refine(
    (data) => {
      const roomTypes = data.roomSelections.map((selection) => selection.roomType);
      return new Set(roomTypes).size === roomTypes.length;
    },
    {
      message: "Cannot select the same room type multiple times",
      path: ["roomSelections"],
    }
  );

const DatePickerWithIcon = ({
  value,
  onChange,
  minDate,
  placeholderText,
  className,
}) => {
  const datePickerRef = useRef(null);

  const handleIconClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };

  return (
    <div className="relative">
      <DatePicker
        ref={datePickerRef}
        selected={value}
        onChange={onChange}
        minDate={minDate}
        dateFormat="MMMM d, yyyy"
        className={cn(
          "w-full px-3 py-2 pr-10 text-left font-normal border rounded-md",
          !value && "text-muted-foreground",
          className
        )}
        placeholderText={placeholderText}
      />
      <CalendarIcon
        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-50 cursor-pointer"
        onClick={handleIconClick}
      />
    </div>
  );
};

export default function BookingForm({
  hotel,
  onSubmit,
  isLoading,
  onBookingSuccess,
}) {
  const [availableRooms, setAvailableRooms] = useState(hotel?.rooms || []);
  const [availabilityError, setAvailabilityError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add flag to prevent double submission

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      checkIn: new Date(),
      checkOut: new Date(new Date().setDate(new Date().getDate() + 1)),
      roomSelections: [{ roomType: hotel?.rooms?.[0]?.type || "", numRooms: 1 }],
      specialRequests: "",
    },
  });

  const watchedValues = form.watch();
  const roomSelections = form.watch("roomSelections") || [];

  const [createBooking] = useCreateBookingMutation();

  const checkInISO = watchedValues.checkIn?.toISOString();
  const checkOutISO = watchedValues.checkOut?.toISOString();

  const {
    data: availabilityData,
    error: fetchError,
    isFetching,
  } = useGetRoomAvailabilityQuery(
    {
      hotelId: hotel?._id,
      checkIn: checkInISO,
      checkOut: checkOutISO,
    },
    {
      skip: !hotel?._id || !checkInISO || !checkOutISO,
    }
  );

  useEffect(() => {
    if (isFetching) {
      setAvailabilityError("Checking availability...");
      return;
    }

    if (fetchError) {
      console.error("Error fetching availability:", fetchError);
      setAvailabilityError("Failed to check room availability. Please try again.");
      setAvailableRooms([]);
      return;
    }

    if (availabilityData) {
      const filteredRooms = hotel.rooms.filter((room) =>
        availabilityData.some((ar) => ar.type === room.type && ar.availableCount > 0)
      );
      setAvailableRooms(filteredRooms);
      setAvailabilityError(null);

      if (filteredRooms.length === 0) {
        setAvailabilityError(
          "No rooms are available for the selected dates. Please choose different dates."
        );
        form.setValue("roomSelections", []);
      } else {
        const currentSelections = form.getValues("roomSelections");
        const updatedSelections = currentSelections.filter((selection) =>
          filteredRooms.some((room) => room.type === selection.roomType)
        );
        if (updatedSelections.length === 0 && filteredRooms.length > 0) {
          updatedSelections.push({ roomType: filteredRooms[0].type, numRooms: 1 });
        }
        form.setValue("roomSelections", updatedSelections);
      }
    }
  }, [availabilityData, fetchError, isFetching, hotel.rooms, form]);

  const addRoomSelection = () => {
    const availableOptions = availableRooms.filter(
      (room) =>
        !roomSelections.some((selection) => selection.roomType === room.type)
    );
    if (availableOptions.length > 0) {
      form.setValue("roomSelections", [
        ...roomSelections,
        { roomType: availableOptions[0].type, numRooms: 1 },
      ]);
    }
  };

  const removeRoomSelection = (index) => {
    const newSelections = roomSelections.filter((_, i) => i !== index);
    form.setValue("roomSelections", newSelections.length > 0
      ? newSelections
      : [{ roomType: availableRooms[0]?.type || "", numRooms: 1 }]
    );
  };

  const handleSubmit = async (data, event) => {
    event.preventDefault();
    if (isSubmitting) return; 

    setIsSubmitting(true); 
    try {
      const bookingData = {
        ...data,
        hotelId: hotel._id,
        checkIn: data.checkIn.toISOString(),
        checkOut: data.checkOut.toISOString(),
      };

    

      const toastId = toast.loading("Creating booking...");
      const result = await createBooking(bookingData).unwrap();

      toast.success("Booking created successfully", { id: toastId });
      await onSubmit(bookingData);
      form.reset();
      if (onBookingSuccess) onBookingSuccess();
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error("Failed to create booking");
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="checkIn"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Check-in Date</FormLabel>
                <FormControl>
                  <DatePickerWithIcon
                    value={field.value}
                    onChange={(date) => {
                      if (date) {
                        field.onChange(date);
                        const currentCheckOut = form.getValues("checkOut");
                        if (date >= currentCheckOut) {
                          const newCheckOut = new Date(date);
                          newCheckOut.setDate(date.getDate() + 1);
                          form.setValue("checkOut", newCheckOut);
                        }
                      }
                    }}
                    minDate={new Date()}
                    placeholderText="Pick a date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="checkOut"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Check-out Date</FormLabel>
                <FormControl>
                  <DatePickerWithIcon
                    value={field.value}
                    onChange={(date) => date && field.onChange(date)}
                    minDate={
                      form.getValues("checkIn") > new Date()
                        ? form.getValues("checkIn")
                        : new Date()
                    }
                    placeholderText="Pick a date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {availabilityError ? (
          <div className="text-red-500 text-center">{availabilityError}</div>
        ) : (
          <div className="space-y-4">
            {roomSelections.map((selection, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 items-end">
                <FormField
                  control={form.control}
                  name={`roomSelections.${index}.roomType`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a room type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableRooms
                            .filter(
                              (room) =>
                                !roomSelections.some(
                                  (s, i) => i !== index && s.roomType === room.type
                                )
                            )
                            .map((room) => (
                              <SelectItem key={room.type} value={room.type}>
                                {room.type} - ${room.price}/night
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`roomSelections.${index}.numRooms`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Rooms</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} max={10} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeRoomSelection(index)}
                  disabled={roomSelections.length === 1}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addRoomSelection}
              disabled={availableRooms.length <= roomSelections.length || isFetching}
            >
              Add Another Room Type
            </Button>
          </div>
        )}

        <FormField
          control={form.control}
          name="specialRequests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Requests (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Any special requests or preferences?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {availableRooms.length > 0 && (
          <div className="flex justify-between items-center pt-4">
            <div className="text-lg font-bold">
              Total: $
              {calculateTotal(
                hotel,
                roomSelections,
                watchedValues.checkIn,
                watchedValues.checkOut
              )}
            </div>
            <Button
              type="submit"
              disabled={isLoading || isSubmitting || availableRooms.length === 0 || isFetching}
            >
              {isLoading || isSubmitting ? "Processing..." : "Confirm Booking"}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}

function calculateTotal(hotel, roomSelections, checkIn, checkOut) {
  if (!hotel || !roomSelections?.length || !checkIn || !checkOut) return "0.00";

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (isNaN(checkInDate) || isNaN(checkOutDate)) return "0.00";

  const nights = Math.max(
    1,
    Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
  );

  const total = roomSelections.reduce((sum, selection) => {
    const room = hotel.rooms.find((r) => r.type === selection.roomType);
    if (!room) return sum;
    return sum + room.price * nights * selection.numRooms;
  }, 0);

  return total.toFixed(2);
}