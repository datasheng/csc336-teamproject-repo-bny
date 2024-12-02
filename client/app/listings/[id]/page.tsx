"use client"

import ListingPage from '@/components/Listingpage';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';

interface Listing {
  listing_photo_id?: string;
  status: string;
  address: string;
  rent: number;
  beds: number;
  baths: number;
  levels: number;
  sqft: number;
  description: string;
  author_id: string;
  listing_id: string;
}

const ListingsPage = () => {
  const router = useRouter();
  const supabase = createClient();
  const { id } = useParams();
  
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserAndFetchListing = async () => {
      try {
        // Check if user is logged in
        const { data: { user } } = await supabase.auth.getUser();

        // Fetch listing data based on id
        const { data: listingData, error } = await supabase
          .from('listings')
          .select('*')
          .eq('listing_id', id)
          .single();

          console.log(listingData)
        if (error) {
          console.error('Error fetching listing:', error);
          return;
        }

        if (!listingData) {
          router.push('/404'); // or handle missing listing case
          return;
        }

        setListing(listingData);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserAndFetchListing();
  }, [id, router, supabase]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (!listing) {
    return <div className="flex min-h-screen items-center justify-center">Listing not found</div>;
  }

  return (
    <div className="flex min-h-screen">
      <ListingPage 
        imageUrl={listing.listing_photo_id ? [listing.listing_photo_id] : ["/placeholder.jpg"]}
        status={listing.status}
        address={listing.address}
        rent={listing.rent}
        beds={listing.beds}
        baths={listing.baths}
        levels={listing.levels}
        sqft={listing.sqft}
        description={listing.description}
        author={listing.author_id}
        listingId={listing.listing_id}
      />
    </div>
  );
};

export default ListingsPage;