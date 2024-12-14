"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import ListingCard from "@/components/ListingCard";
import SearchBar from "@/components/SearchBar";
import Filter from "@/components/Filter";
import Header from "@/components/Header";

const SearchPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    setLoading(true);
    const keyword = searchParams.get("keyword") || "";
    const beds = searchParams.get("beds") || "";
    const baths = searchParams.get("baths") || "";
    const rent = searchParams.get("rent") || "";
    const levels = searchParams.get("levels") || "";
    const sqft = searchParams.get("sqft") || "";

    let query = supabase.from("listings").select("*");

    if (keyword) {
      query = query.ilike("title", `%${keyword}%`)
        .or(`description.ilike.%${keyword}%`)
        .or(`address.ilike.%${keyword}%`);
    }

    if (beds) query = query.eq("beds", beds);
    if (baths) query = query.eq("baths", baths);
    if (rent) query = query.lte("rent", rent);
    if (levels) query = query.eq("levels", levels);
    if (sqft) query = query.gte("sqft", sqft);

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching listings:", error);
    } else {
      setListings(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, [searchParams]);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-4">
        {/* Search Bar */}
        <div className="flex justify-center mb-4">
          <SearchBar />
        </div>

        {/* Layout */}
        <div className="flex">
          {/* Filters Sidebar */}
          <aside className="w-1/4 shadow-lg p-4 rounded-lg">
            <h2 className="font-semibold text-lg mb-4">Filters</h2>
            <Filter />
          </aside>

          {/* Listings Section */}
          <main className="flex-1 ml-4">
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : (
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  Results ({listings.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.map((listing) => (
                    <ListingCard
                      key={listing.listing_id}
                      imageUrl={listing.imageURL || "/placeholder.jpg"}
                      status={listing.status}
                      address={listing.address}
                      rent={listing.rent}
                      beds={listing.beds}
                      baths={listing.baths}
                      levels={listing.levels}
                      sqft={listing.sqft}
                      author={listing.author_id}
                      listingID={listing.listing_id}
                    />
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;