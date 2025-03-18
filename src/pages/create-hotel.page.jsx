import { Button } from "@/components/ui/button";
import { useCreateHotelMutation } from "@/lib/api";
import { toast } from "sonner";
export default function CreateHotelPage() {

const [createHotel, { isLoading }] = useCreateHotelMutation();

const handleClick=async ()=>{
try{
    toast.loading("Creating hotel...");
   await createHotel({
        name:"Opulent River Face Hotel",
        location:"Kotte,Sri Lanka",
        rating:4,
        reviews:100,
        image:"https://cf.bstatic.com/xdata/images/hotel/max1280x900/297840629.jpg?k=d20e005d5404a7bea91cb5fe624842f72b27867139c5d65700ab7f69396026ce&o=&hp=1",
        price:100,
        description:"Opulent River Face Hotel is located in Kotte, 3.1 mi from Colombo. The hotel has a terrace and views of the river, and guests can enjoy a meal at the restaurant. Free private parking is available on site.",
    }).unwrap(); // we don't need error states to give above in case error occusrs here it will show directky below
toast.success("Hotel created successfully");
}catch(error){
   toast.error("Failed to create hotel");
}
}
    return <main>
        <h1 className="text-2xl font-bold">Create Hotel</h1>
        <div className="mt-4">
            <Button onClick={handleClick}>Create Hotel</Button>
        </div>
    </main>
}