"use server"

import { createClient } from '@/utils/supabase/server';
import ListingCard from '@/components/ListingCard';
import Header from '@/components/Header';

const ListingsPage = async () => {
  const supabase = await createClient();
  const {data: listings, error} = await supabase.from("listings").select("*");

  if(error){
    console.error('Error fetching listings: ', error.message)
    return <p>Error loading listings</p>
  }

  const getListingImages = async(listingID: string) => {
    try{
      const {data: files, error: listError} = await supabase.storage.from('listing-photos').list(`${listingID}`, { limit: 100 });

      if(listError){
        console.error(`Error listing files for ${listingID}: `, listError.message);
        return `/placeholder.jpg`;
      }

      if(files && files.length > 0){
        supabase.storage.from('listing-photos').getPublicUrl(`${listingID}/${files[0].name}`);

        const publicURLs = await Promise.all(
          files.map(async (file) => {
            const { data: publicURLData } = await supabase.storage.from('listing-photos').getPublicUrl(`${listingID}/${file.name}`);
            return publicURLData?.publicUrl || "/placeholder.jpg"; // Return the URL or a placeholder if not found
          })
        )

        return publicURLs || "/placeholder.jpg";
      }

      return "/placeholder.jpg";
    }catch(error){
      console.error(`Error fetching image for ${listingID}: `, error)
      return "/placeholder.jpg";
    }
  };

  const listingWithImages = await Promise.all(
    listings.map(async(listing: any) => {
      const imageURL = await getListingImages(listing.listing_id);

      return {...listing, imageURL};
    })
  );
  
  return (
    <div className="container mx-auto px-4">
      <Header/>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listingWithImages.map((listing: any) => {
          return (
            <div key={listing.listing_id} className="w-full cursor-pointer">
              <ListingCard
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
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ListingsPage;