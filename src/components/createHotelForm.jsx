import { number, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui//textarea";
import { toast } from "sonner";
import { useCreateHotelMutation } from "@/lib/api";

const formSchema = z.object({
    name: z.string().min(1, "Hotel name is required"),
    location: z.string().min(1, "Location is required"),
    image: z.string().min(1, "Image URL is required"),
    price: z.preprocess((val) => Number(val) || 0, z.number().positive("Price must be a positive number")),
    description: z.string().min(1, "Description is required"),
});

const CreateHotelForm = () => {
    const [createHotel, { isLoading }] = useCreateHotelMutation();
    const form = useForm({
        resolver: zodResolver(formSchema), //resolver is used to validate the form
        defaultValues: {
            name: "",
            location: "",
            image: "",
            price: 0,
            description: "",
        },
    });

    const handleSubmit =async (values) => {
        const { name, location, image, price, description } = values;
        try {
    toast.loading("Creating hotel...");
               await createHotel({
                    name,
                    location,
                    image,
                    price,
                    description,
                }).unwrap(); // we don't need error states to give above in case error occusrs here it will show directky below
                 toast.success("Hotel created successfully");
        } catch (error) {
               toast.error("Failed to create hotel");
        }
    }

    return (
        <Form {...form}>
            <form  className="w-1/2" onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="grid gap-4">
                    <FormField
                        control={form.control} //control handles all the updates in the states internally
                        name="name" //name is the key in the formSchema
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hotel Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Hotel Name" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Enter the name of Hotek
                                </FormDescription>
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
                                <Input placeholder="Location" {...field} />
                            </FormControl>
                            <FormDescription>
                                Enter the location of the hotel
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image</FormLabel>
                            <FormControl>
                                <Input placeholder="Image URL" {...field} />
                            </FormControl>
                            <FormDescription>
                                Enter the image URL of the hotel
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Price" onChange={(e) =>{
                                    field.onChange(parseFloat(e.target.value));
                                }} value={field.value}
                                 />
                            </FormControl>
                            <FormDescription>
                                Enter the price of the hotel
                            </FormDescription>
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
                                <Textarea placeholder="Description" {...field} />
                            </FormControl>
                            <FormDescription>
                                Enter the description of the hotel
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                </div>
                <div className="mt-4">
                    <Button type="submit">Create Hotel</Button>
                </div>
            </form>
        </Form>
    );
};

export default CreateHotelForm;