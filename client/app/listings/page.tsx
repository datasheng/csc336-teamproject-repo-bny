"use server"
import { createClient } from '@/utils/supabase/server';
import ListingCard from '@/components/ListingCard';
import Link from 'next/link';

const ListingsPage = async () => {
  const supabase = await createClient();
  const {data} = await supabase.from("listings").select("*");
  console.log(data)
  
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data && data?.map((listing: any) => {
          return (
            <Link 
              href={`/listings/${listing.listing_id}`} 
              key={listing.listing_id}
              className="w-full cursor-pointer"
            >
              <ListingCard
                imageUrl={listing.listing_photo_id || "/placeholder.jpg"}
                status={listing.status}
                address={listing.address}
                rent={listing.rent}
                beds={listing.beds}
                baths={listing.baths}
                levels={listing.levels}
                sqft={listing.sqft}
                author={listing.author_id}
                
              />
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default ListingsPage;