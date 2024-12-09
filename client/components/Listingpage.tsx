'use client';
import Image from 'next/legacy/image';
import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface PropertyCardProps {
  imageUrl: string[];
  status: string;
  address: string;
  rent: number;
  beds: number;
  baths: number;
  levels: number;
  sqft: number;
  description?: string;
  author: string; // This should be a UUID
  listingId: string; // This should be a UUID
}

const ListingPage: React.FC<PropertyCardProps> = ({
  imageUrl,
  status,
  address,
  rent,
  beds,
  baths,
  levels,
  sqft,
  description,
  author,
  listingId,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  // console.log('author', author);
  // console.log('listingId', listingId);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error('Error fetching user:', error);
        return;
      }

      setUser(user);
    };

    fetchUser();
  }, [supabase]);

  const handleNext = () => {
    setCurrentIdx((prevIdx) => (prevIdx + 1) % imageUrl.length);
  };

  const handlePrev = () => {
    setCurrentIdx((prevIdx) =>
      prevIdx === 0 ? imageUrl.length - 1 : prevIdx - 1
    );
  };

  const initiateMessage = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!user?.id) {
        setError('Please log in to send messages');
        return;
      }

      if (!listingId || !author) {
        setError('Invalid listing information');
        return;
      }

      // Check if a chat already exists
      const { data: existingChat, error: chatError } = await supabase
        .from('chat')
        .select('chat_id')
        .eq('listing_id', listingId)
        .eq('host_id', author)
        .eq('roommate_id', user.id)
        .single();

      if (chatError && chatError.code !== 'PGRST116') {
        // PGRST116 is "not found" error
        throw new Error(`Error checking existing chat: ${chatError.message}`);
      }

      if (existingChat) {
        // Chat exists, navigate to it
        router.push(`/chat/${existingChat.chat_id}`);
      } else {
        // Create new chat
        const { data: newChat, error: createError } = await supabase
          .from('chat')
          .insert([
            {
              listing_id: listingId,
              host_id: author,
              roommate_id: user.id,
              host_matched: false,
              roommate_matched: false,
            },
          ])
          .select()
          .single();

        if (createError) {
          throw new Error(`Error creating chat: ${createError.message}`);
        }

        if (newChat) {
          router.push(`/chat/${newChat.chat_id}`);
        }
      }
    } catch (err) {
      console.error('Error:', err);
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/listings/${listingId}/edit`);
  };

  return (
    <div className='w-full rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow m-16'>
      <div className='flex flex-col md:flex-row'>
        {/* Left side - Images */}
        <div className='md:w-1/2 relative h-[400px]'>
          {imageUrl.length > 0 ? (
            <Image
              src={imageUrl[currentIdx]}
              alt={`Image ${currentIdx + 1}`}
              layout='fill'
              objectFit='cover'
              priority
            />
          ) : (
            <Image
              src='/placeholder.jpg'
              alt='PlaceHolder'
              layout='fill'
              objectFit='cover'
              priority
            />
          )}

          <span className='absolute top-4 left-4 bg-red-600 text-white font-bold px-4 py-2 rounded'>
            {status}
          </span>

          {imageUrl.length > 0 && (
            <>
              <button
                className='absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-700 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 focus:outline-none'
                onClick={handlePrev}
              >
                &larr;
              </button>
              <button
                className='absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-700 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 focus:outline-none'
                onClick={handleNext}
              >
                &rarr;
              </button>
              <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-gray-900 bg-opacity-75 px-4 py-2 rounded'>
                {currentIdx + 1} / {imageUrl.length}
              </div>
            </>
          )}
        </div>

        {/* Right side - Property Info */}
        <div className='md:w-1/2 p-6'>
          <div className='flex flex-row justify-between items-center'>
            <h2 className='text-3xl font-semibold mb-4'>{address}</h2>

            {user?.id === author ? (
              <div className=''>
                <Button onClick={handleEdit}>Edit</Button>
              </div>
            ) : (
              <Button
                onClick={initiateMessage}
                disabled={isLoading || !user}
                className='min-w-[100px]'
              >
                {isLoading ? 'Loading...' : 'Message'}
              </Button>
            )}
          </div>

          {error && <div className='text-red-500 mb-4'>{error}</div>}

          <p className='text-2xl font-bold text-red-600 mb-6'>
            ${rent.toLocaleString()}/month
          </p>

          <div className='grid grid-cols-4 gap-4 mb-6'>
            <div className='text-center'>
              <p className='text-gray-600'>Beds</p>
              <p className='text-xl font-semibold'>{beds}</p>
            </div>
            <div className='text-center'>
              <p className='text-gray-600'>Baths</p>
              <p className='text-xl font-semibold'>{baths}</p>
            </div>
            <div className='text-center'>
              <p className='text-gray-600'>Levels</p>
              <p className='text-xl font-semibold'>{levels}</p>
            </div>
            <div className='text-center'>
              <p className='text-gray-600'>Sqft</p>
              <p className='text-xl font-semibold'>{sqft.toLocaleString()}</p>
            </div>
          </div>

          {description && (
            <div className='mt-6'>
              <h3 className='text-xl font-semibold mb-2'>Description</h3>
              <p className='text-gray-700 leading-relaxed'>{description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingPage;
