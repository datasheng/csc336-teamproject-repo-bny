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
    const beds = searchParams.get("beds") || ""; // e.g., "3-10"
    const baths = searchParams.get("baths") || "";
    const rent = searchParams.get("rent") || ""; // e.g., "500-5000"
    const levels = searchParams.get("levels") || "";
    const sqft = searchParams.get("sqft") || "";
  
    let query = supabase.from("listings").select("*");
  
    if (keyword) {
      query = query.or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%,address.ilike.%${keyword}%`);
    }
  
    // Handle ranges (e.g., "3-10" -> min=3, max=10)
    const applyRangeFilter = (param, columnName) => {
      if (param) {
        const [min, max] = param.split("-").map(Number);
        if (min) query = query.gte(columnName, min);
        if (max) query = query.lte(columnName, max);
      }
    };
  
    applyRangeFilter(beds, "beds");
    applyRangeFilter(baths, "baths");
    applyRangeFilter(rent, "rent");
    applyRangeFilter(levels, "levels");
    applyRangeFilter(sqft, "sqft");
  
    const { data, error } = await query;
  
    if (error) {
      console.error("Error fetching listings:", error);
      setLoading(false);
      return;
    }
  
    const getListingImages = async (listingID) => {
      const { data, error } = await supabase.storage
        .from('listing-photos')
        .list(`${listingID}/`, { limit: 100 });
  
      if (error) {
        console.error(`Error listing files for ${listingID}: `, error.message);
        return ["/placeholder.jpg"];
      }
  
      if (data && data.length > 0) {
        const publicURLs = await Promise.all(
          data.map(async (file) => {
            const { data: publicURLData } = supabase.storage
              .from('listing-photos')
              .getPublicUrl(`${listingID}/${file.name}`);
            return publicURLData?.publicUrl || "/placeholder.jpg";
          })
        );
  
        return publicURLs;
      }
  
      return ["/placeholder.jpg"];
    };
  
    const listingsWithImages = await Promise.all(
      data.map(async (listing) => {
        const imageURLs = await getListingImages(listing.listing_id);
        return { ...listing, imageURLs };
      })
    );
  
    setListings(listingsWithImages);
    setLoading(false);
  };  

  useEffect(() => {
    fetchListings();
  }, [searchParams]);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-center mb-4">
          <SearchBar />
        </div>
        <div className="flex">
          <aside className="w-1/4 shadow-lg p-4 rounded-lg">
            <h2 className="font-semibold text-lg mb-4">Filters</h2>
            <Filter />
          </aside>
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
                      imageUrl={listing.imageURLs}
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