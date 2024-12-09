'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import ListingCard from '@/components/ListingCard';
import { FileUpload } from '@/components/ui/file-upload';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

const labels = [
  { id: 'title', name: 'Title', type: 'text' },
  { id: 'description', name: 'Description', type: 'text' },
  { id: 'address', name: 'Address', type: 'text' },
  { id: 'status', name: 'Status', type: 'text' },
  { id: 'rent', name: 'Rent', type: 'number' },
  { id: 'max_roommates', name: 'Max Roommates', type: 'number' },
  { id: 'beds', name: 'Bedrooms', type: 'number' },
  { id: 'baths', name: 'Bathrooms', type: 'number' },
  { id: 'levels', name: 'Levels', type: 'number' },
  { id: 'sqft', name: 'Square Feet', type: 'number' },
];

const EditListingPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    address: '',
    rent: 0,
    max_roommates: 0,
    beds: 0,
    baths: 0,
    levels: 1,
    sqft: 0,
  });

  const [files, setFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = useParams();
  const supabase = createClient();

  useEffect(() => {
    const fetchListingData = async () => {
      try {
        // Check if user is logged in and get their ID
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        // Fetch the listing
        const { data: listing, error: listingError } = await supabase
          .from('listings')
          .select('*')
          .eq('listing_id', id)
          .single();

        if (listingError) {
          throw listingError;
        }

        // Check if the user is the author
        if (listing.author_id !== user.id) {
          router.push('/unauthorized');
          return;
        }

        // Set form data
        setFormData(listing);

        // Fetch existing images
        const { data: existingImages, error: imageError } =
          await supabase.storage
            .from('listing-photos')
            .list(id + '/', { limit: 100 });

        if (!imageError && existingImages) {
          const urls = await Promise.all(
            existingImages.map(async (file) => {
              const { data } = supabase.storage
                .from('listing-photos')
                .getPublicUrl(`${id}/${file.name}`);
              return data?.publicUrl || '/placeholder.jpg';
            })
          );
          setImagePreviews(urls);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load listing data');
      } finally {
        setLoading(false);
      }
    };

    fetchListingData();
  }, [id, router, supabase]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]:
        id === 'rent' ||
        id === 'sqft' ||
        id === 'beds' ||
        id === 'baths' ||
        id === 'levels' ||
        id === 'max_roommates'
          ? parseInt(value)
          : value,
    }));
  };

  const handleFileUpload = (uploadFiles: File[]) => {
    const updatedFiles = [...files, ...uploadFiles];
    setFiles(updatedFiles);

    const previews = updatedFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Update listing data
      const { error: updateError } = await supabase
        .from('listings')
        .update(formData)
        .eq('listing_id', id);

      if (updateError) {
        throw updateError;
      }

      // Handle new image uploads if any
      if (files.length > 0) {
        const photoInsert = files.map(async (file) => {
          const { data: storageData, error: storageError } =
            await supabase.storage
              .from('listing-photos')
              .upload(`${id}/${uuidv4()}`, file);

          if (storageError) {
            console.error('Error uploading file: ', storageError);
            return null;
          }

          const { publicURL } = supabase.storage
            .from('listing-photos')
            .getPublicUrl(storageData.path);

          const { error: photoError } = await supabase
            .from('listing_photos')
            .insert({
              listing_id: id,
              image_url: publicURL,
            });

          if (photoError) {
            console.error('Error inserting photo: ', photoError);
            return null;
          }

          return publicURL;
        });

        const uploadedPhotos = await Promise.all(photoInsert);

        if (uploadedPhotos.includes(null)) {
          setError('Some photos were not uploaded');
          return;
        }
      }

      router.push(`/listings/${id}`);
    } catch (err) {
      console.error('Error updating listing: ', err);
      setError('Failed to update listing');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center text-red-500'>
        {error}
      </div>
    );
  }

  return (
    <div className='flex'>
      <form className='flex-1 p-4 w-[600px]' onSubmit={handleSubmit}>
        <h2 className='text-2xl font-semibold mb-4 dark:text-white'>
          Edit Listing
        </h2>

        {labels.map((label, index) => (
          <div className='mb-4' key={index}>
            <label
              htmlFor={label.id}
              className='block text-sm font-medium text-gray-700 dark:text-white'
            >
              {label.name}
            </label>
            <input
              type={label.type}
              id={label.id}
              name={label.id}
              value={formData[label.id as keyof typeof formData]}
              className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:text-white'
              onChange={handleInputChange}
            />
          </div>
        ))}

        <div className='w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg'>
          <FileUpload onChange={handleFileUpload} />
        </div>

        <Button
          type='submit'
          className='w-full dark:bg-white text-white py-2 rounded-md hover:bg-blue-800 dark:text-black'
          disabled={loading}
        >
          {loading ? 'Updating Listing...' : 'Update Listing'}
        </Button>
      </form>

      <div className='max-w-lg w-full p-4 ml-4 rounded-md shadow-md'>
        <h2 className='text-2xl font-semibold mb-4 dark:text-white'>
          Listing Preview
        </h2>

        <ListingCard
          imageUrl={imagePreviews}
          status={formData.status}
          address={formData.address}
          rent={formData.rent}
          beds={formData.beds}
          baths={formData.baths}
          levels={formData.levels}
          sqft={formData.sqft}
          author={formData.author_id}
          listingID={id as string}
        />
      </div>
    </div>
  );
};

export default EditListingPage;
