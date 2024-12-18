import { useRouter } from "next/navigation";
import { useState } from "react";

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
    <form onSubmit={handleSearch} className="flex items-center w-full max-w-2xl p-2 rounded-lg shadow-lg">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search listings..."
        className="flex-grow p-2 border-none focus:outline-none"
      />
      <button
        type="submit"
        className="px-4 py-2 font-semibold rounded-lg transition"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;