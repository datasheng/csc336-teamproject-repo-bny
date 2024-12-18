import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";

const SearchBar = () => {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    params.set("keyword", keyword);
    router.push(`/listings/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center w-full max-w-md rounded-full border-2 px-4 py-2 shadow-md"
    >
      <IoSearchOutline className="mr-2" size={20} />
      <input
      type="text"
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      placeholder="Search listings..."
      className="flex-grow border-none bg-transparent focus:outline-none"
      />
      <button
        type="submit"
        className="hidden"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;