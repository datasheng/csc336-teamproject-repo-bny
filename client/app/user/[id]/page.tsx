"use client";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

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
  images: string[];  // This will hold the image URLs for each listing
  status: string;
  address: string;
  rent: number;
  beds: number;
  baths: number;
  levels: number;
  sqft: number;
  author_id: string;
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

  // Add new state for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    phone_number: ''
  });

  // Add new state for image upload
  const [uploading, setUploading] = useState(false);

  // Add handler for edit form
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('user')
        .update({
          full_name: editFormData.full_name,
          username: editFormData.username,
          email: editFormData.email,
          phone_number: editFormData.phone_number
        })
        .eq('user_id', currentUser?.id);

      if (error) throw error;
      setProfile({ ...profile, ...editFormData, avatar_url: profile?.avatar_url || null, user_type: profile?.user_type || 'roommate' });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Add upload handler function after existing state declarations
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      // Create unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUser?.id}-${Math.random()}.${fileExt}`;

      // Upload to Supabase
      const { error: uploadError } = await supabase.storage
        .from('pfp')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('pfp')
        .getPublicUrl(fileName);

      // Update user profile
      const { error: updateError } = await supabase
        .from('user')
        .update({ avatar_url: urlData?.publicUrl })
        .eq('user_id', currentUser?.id);

      if (updateError) throw updateError;

      // Update local state
      setProfile(prev => prev ? {
        ...prev,
        avatar_url: urlData?.publicUrl || null
      } : null);

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchProfileAndListings = async () => {
      try {
        // Fetch profile data based on username from URL
        const { data: profileData, error: profileError } = await supabase.from('user').select('*').eq('username', userName).single();

        if (profileError) throw profileError;

        setProfile(profileData);

        if (profileData.user_type === 'host') {
          const { data: listingsData, error: listingsError } = await supabase.from('listings')
            .select(`
              listing_id,
              title,
              description,
              status,
              address,
              rent,
              beds,
              baths,
              levels,
              sqft,
              author_id,
              created_at
            `)
            .eq('author_id', profileData.user_id)
            .order('created_at', { ascending: false });

          if (listingsError) {
            console.log(listingsError);
          }

          // Fetch images for each listing
          if (listingsData) {
            const listingsWithImages = await Promise.all(listingsData.map(async (listing) => {
              const { data: imagesData, error: imagesError } = await supabase.storage.from('listing-photos').list(`${listing.listing_id}/`, { limit: 10 });
              
              if (imagesError) {
                console.error('Error fetching images:', imagesError);
                return { ...listing, images: ["/placeholder.jpg"] }; // Placeholder if images not found
              }

              const imageUrls = imagesData?.map((file) => {
                const { data: urlData } = supabase.storage.from('listing-photos').getPublicUrl(`${listing.listing_id}/${file.name}`);
                return urlData?.publicUrl || "/placeholder.jpg";
              });

              return { ...listing, images: imageUrls || ["/placeholder.jpg"] };
            }));

            setListings(listingsWithImages);
          }
        }
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userName) {
      fetchProfileAndListings();
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
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-8">
          <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg" />
          <div className="absolute -bottom-16 left-8 flex items-end space-x-6">
            <div className="relative w-32 h-32">
              <Image
                src={profile?.avatar_url || '/default-avatar.png'}
                alt="Profile"
                layout="fill"
                objectFit="cover"
                className="rounded-full ring-4 ring-white dark:ring-gray-900"
              />
              {isOwner && (
                <label 
                  className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
                  htmlFor="avatar-upload"
                >
                  {uploading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  )}
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div className="pb-4">
              <h1 className="text-3xl font-bold text-black dark:text-white">
                {profile?.full_name || profile?.username}
              </h1>
              <Badge variant="secondary" className="mt-2">
                {profile?.user_type === 'host' ? 'Property Host' : 'Looking for Room'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-20">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="listings">Listings</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-2xl font-bold text-blue-600">
                      {listings.length || "0"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {listings.length === 0 ? "No listings" : "Total Listings"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-2xl font-bold text-green-600">
                      {format(new Date(profile?.created_at || ''), 'MMM yyyy')}
                    </h3>
                    <p className="text-sm text-gray-500">Member Since</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-2xl font-bold text-purple-600">
                      {/* Add rating or other metric */}
                      4.8
                    </h3>
                    <p className="text-sm text-gray-500">Rating</p>
                  </CardContent>
                </Card>
              </div>

              {/* Profile Info */}
              <Card>
                <CardHeader className="flex justify-between flex-row items-center px-6">
                  <h3 className="text-xl font-semibold">Profile Information</h3>
                  {isOwner && !isEditing && (
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setEditFormData({
                          full_name: profile?.full_name || '',
                          username: profile?.username || '',
                          email: profile?.email || '',
                          phone_number: profile?.phone_number || ''
                        });
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Edit Profile
                    </button>
                  )}
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {isEditing ? (
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Full Name</label>
                          <input
                            type="text"
                            value={editFormData.full_name}
                            onChange={e => setEditFormData(prev => ({ ...prev, full_name: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Username</label>
                          <input
                            type="text"
                            value={editFormData.username}
                            onChange={e => setEditFormData(prev => ({ ...prev, username: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Email</label>
                          <input
                            type="email"
                            value={editFormData.email}
                            onChange={e => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Phone</label>
                          <input
                            type="tel"
                            value={editFormData.phone_number}
                            onChange={e => setEditFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Full Name</label>
                        <p className="text-lg">{profile?.full_name || 'Not set'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Username</label>
                        <p className="text-lg">{profile?.username}</p>
                      </div>
                      {isOwner && (
                        <>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Email</label>
                            <p className="text-lg">{profile?.email}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Phone</label>
                            <p className="text-lg">{profile?.phone_number || 'Not set'}</p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="listings">
              {profile?.user_type === 'host' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">
                      {isOwner ? 'Your Listings' : `${profile.full_name || profile.username}'s Listings`}
                    </h2>
                    {isOwner && (
                      <Link href="/listings/new" className="btn">
                        Add New Listing
                      </Link>
                    )}
                  </div>

                  {listings.length === 0 ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <div className="space-y-4">
                          <div className="text-6xl">🏠</div>
                          <h3 className="text-xl font-semibold">No Listings Yet</h3>
                          <p className="text-gray-500">
                            {isOwner ? "Ready to post your first listing?" : "This user hasn't posted any listings yet."}
                          </p>
                        </div>
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
                            author={listing.author_id}
                            listingID={listing.listing_id}
                          />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default UserPage;
