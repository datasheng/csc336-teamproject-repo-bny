"use client"
import React, { useState, useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";
import useUser from '@/utils/useUser';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/legacy/image";
import Link from 'next/link';
import Header from '@/components/Header';
import ListingCard from '@/components/ListingCard';

interface UserProfile {
  email: string;
  phone_number: string | null;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  user_type: 'host' | 'roommate';
}

interface Listing {
  listing_id: string;
  images: string[];
  status: string;
  address: string;
  rent: number;
  beds: number;
  baths: number;
  levels: number;
  sqft: number;
  author: string;
  created_at: string;
}

const UserPage = () => {
  const pathname = usePathname();
  const userName = pathname.split('/').pop();
  const currentUser = useUser();
  const isOwner = currentUser?.user_metadata?.username === userName;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchProfileAndListings = async () => {
      try {
        // Fetch profile data based on username from URL
        const { data: profileData, error: profileError } = await supabase
          .from('user')
          .select('*')
          .eq('username', userName)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        if (profileData.user_type === 'host') {
          const { data: listingsData, error: listingsError } = await supabase
            .from('listings')
            .select(`
              listing_id,
              images,
              status,
              address,
              rent,
              beds,
              baths,
              levels,
              sqft,
              author,
              created_at
            `)
            .eq('host_id', profileData.user_id)
            .order('created_at', { ascending: false });

          if (listingsError) throw listingsError;
          setListings(listingsData || []);
        }
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userName) {
      fetchProfileAndListings();++
    }
  }, [userName, supabase]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-6 w-56" />
              <Skeleton className="h-6 w-52" />
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (error || !profile) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error || `Profile not found for username: ${userName}`}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16">
                <Image
                  src={profile.avatar_url || '/default-avatar.png'}
                  alt="Profile"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {isOwner ? 'Your Profile' : `${profile.full_name || profile.username}'s Profile`}
                </h1>
                {isOwner && <p className="text-gray-500">Welcome back!</p>}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Full Name</label>
              <p className="text-lg">{profile.full_name || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Username</label>
              <p className="text-lg">{profile.username || 'Not set'}</p>
            </div>
            {isOwner && (
              <>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="text-lg">{profile.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Phone Number</label>
                  <p className="text-lg">{profile.phone_number || 'Not set'}</p>
                </div>
              </>
            )}
            <div>
              <label className="text-sm text-gray-500">Account Type</label>
              <p className="text-lg capitalize">{profile.user_type}</p>
            </div>
          </CardContent>
        </Card>

        {profile.user_type === 'host' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {isOwner ? 'Your Listings' : `${profile.full_name || profile.username}'s Listings`}
            </h2>
            {listings.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  {isOwner ? 
                    "You haven't posted any listings yet." :
                    "This user hasn't posted any listings yet."}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map(listing => (
                  <Link href={`/listings/${listing.listing_id}`} key={listing.listing_id}>
                    <ListingCard
                      imageUrl={listing.images}
                      status={listing.status}
                      address={listing.address}
                      rent={listing.rent}
                      beds={listing.beds}
                      baths={listing.baths}
                      levels={listing.levels}
                      sqft={listing.sqft}
                      author={listing.author}
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default UserPage;