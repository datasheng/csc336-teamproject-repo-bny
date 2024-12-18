import { useRouter } from "next/navigation";
import { useState } from "react";

const Filter = () => {
  const router = useRouter();
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [rent, setRent] = useState("");
  const [levels, setLevels] = useState("");
  const [sqft, setSqft] = useState("");

  const handleFilter = () => {
    const params = new URLSearchParams(window.location.search);
    if (beds) params.set("beds", beds);
    else params.delete("beds");
    if (baths) params.set("baths", baths);
    else params.delete("baths");
    if (rent) params.set("rent", rent);
    else params.delete("rent");
    if (levels) params.set("levels", levels);
    else params.delete("levels");
    if (sqft) params.set("sqft", sqft);
    else params.delete("sqft");
    router.push(`/listings/search?${params.toString()}`);
  };

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Beds</label>
        <input
          type="number"
          value={beds}
          onChange={(e) => setBeds(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Baths</label>
        <input
          type="number"
          value={baths}
          onChange={(e) => setBaths(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Rent</label>
        <input
          type="number"
          value={rent}
          onChange={(e) => setRent(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Levels</label>
        <input
          type="number"
          value={levels}
          onChange={(e) => setLevels(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Square Feet</label>
        <input
          type="number"
          value={sqft}
          onChange={(e) => setSqft(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>
      <button
        onClick={handleFilter}
        className="w-full p-2 rounded-lg transition"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default Filter;