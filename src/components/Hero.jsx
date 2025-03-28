import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";
import { useDispatch } from "react-redux";
import { submit } from "@/lib/features/searchSlice";
import { useState } from "react";

export default function Hero({ onSearchTriggered }) {
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const searchQuery = searchInput.trim();
    if (!searchQuery) return;
    console.log(searchQuery);
    dispatch(submit(searchQuery));
    onSearchTriggered(); 
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (value.trim() === "") {
      dispatch(submit("")); 
    }
  };

  return (
    <div className="">
      <div className="relative z-10 flex flex-col items-center justify-center px-8 pt-32 pb-32 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center">
          Find Your Best Staycation
        </h1>
        <p className="text-xl mb-12 text-center max-w-2xl">
          Describe your dream staycation and we will find the best deals for you
        </p>

        <form
          onSubmit={handleSearch}
          className="w-full max-w-3xl bg-black/10 backdrop-blur-md lg:h-16 rounded-full p-2 flex items-center"
        >
          <Input
            type="text"
            name="search"
            value={searchInput}
            onChange={handleInputChange}
            placeholder="Describe your experience or hotel"
            className="flex-grow bg-transparent lg:text-lg text-white placeholder:text-white/50 border-none outline-none focus:border-none focus:outline-none"
          />
          <Button
            type="submit"
            className="rounded-full w-48 flex items-center gap-x-2 lg:h-12"
          >
            <Sparkles
              style={{ width: "24px", height: "20px" }}
              className="mr-2 animate-pulse text-sky-400"
            />
            <span className="lg:text-lg">AI Search</span>
          </Button>
        </form>
      </div>
    </div>
  );
}