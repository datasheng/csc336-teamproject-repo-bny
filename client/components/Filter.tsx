import { useRouter } from "next/navigation";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

const Filter = () => {
  const router = useRouter();
  const [beds, setBeds] = useState([1, 10]);
  const [baths, setBaths] = useState([1, 10]);
  const [rent, setRent] = useState([500, 5000]);
  const [levels, setLevels] = useState([1, 5]);
  const [sqft, setSqft] = useState([500, 10000]);

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (beds[0] !== 1 || beds[1] !== 10) params.set("beds", beds.join("-"));
    if (baths[0] !== 1 || baths[1] !== 10) params.set("baths", baths.join("-"));
    if (rent[0] !== 500 || rent[1] !== 5000) params.set("rent", rent.join("-"));
    if (levels[0] !== 1 || levels[1] !== 5) params.set("levels", levels.join("-"));
    if (sqft[0] !== 500 || sqft[1] !== 10000) params.set("sqft", sqft.join("-"));
    router.push(`/listings/search?${params.toString()}`);
  };

  const renderSlider = (label, state, setState, minLimit, maxLimit, step, unit = "") => (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex justify-between mb-2">
        <span>{unit}{state[0]}</span>
        <span>{unit}{state[1]}</span>
      </div>
      <Slider
        min={minLimit}
        max={maxLimit}
        step={step}
        defaultValue={state}
        onValueChange={(value) => setState(value)}
        className="w-full"
      />
    </div>
  );

  return (
    <div>
      {renderSlider("Beds", beds, setBeds, 1, 10, 1)}
      {renderSlider("Baths", baths, setBaths, 1, 10, 1)}
      {renderSlider("Rent", rent, setRent, 500, 5000, 100, "$")}
      {renderSlider("Levels", levels, setLevels, 1, 5, 1)}
      {renderSlider("Square Feet", sqft, setSqft, 500, 10000, 100)}
      <Button
        onClick={handleFilter}
        className="w-full p-2 rounded-lg transition bg-slate-950 text-white hover:bg-slate-800 border border-white"
      >
        Apply Filters
      </Button>
    </div>
  );
};

export default Filter;