"use client"
import React, { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/legacy/image";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Chat {
  chat_id: string;
  other_user_id: string;
  other_user_name: string;
  other_user_avatar: string;
  listing_address?: string;
  latest_message?: {
    content: string;
    created_at: string;
  };
}

interface UserData {
  user_id: string;
  full_name: string;
  avatar_url: string;
}

function ChatsPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndChats = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        if (!user) {
          router.push('/login');
          return;
        }
        
        setUser(user);

        // First fetch chats with basic data
        const { data: chatsData, error: chatError } = await supabase
          .from('chat')
          .select(`
            chat_id,
            listing_id (address),
            host_id,
            roommate_id (user_id, full_name, avatar_url),
            messages (
              content,
              created_at
            )
          `)
          .or(`host_id.eq.${user.id},roommate_id.eq.${user.id}`)
          .order('updated_at', { ascending: false });

        if (chatError) throw chatError;

        // Get unique host IDs
        const hostIds = [...new Set(chatsData
          .map(chat => chat.host_id)
          .filter(id => id !== null))];

        // Fetch host user data
        const { data: hostsData, error: hostsError } = await supabase
          .from('user')
          .select('user_id, full_name, avatar_url')
          .in('user_id', hostIds);

        if (hostsError) throw hostsError;

        // Create a map of host data for easy lookup
        const hostMap = new Map(hostsData.map(host => [host.user_id, host]));

        const formattedChats = chatsData.map(chat => {
          const isCurrentUserHost = chat.host_id === user.id;
          let otherUser: UserData;

          if (isCurrentUserHost) {
            otherUser = chat.roommate_id;
          } else {
            const hostData = hostMap.get(chat.host_id);
            otherUser = {
              user_id: chat.host_id,
              full_name: hostData?.full_name || 'Unknown User',
              avatar_url: hostData?.avatar_url || '/default-avatar.png'
            };
          }
          
          // Get the latest message if available
          const latestMessage = chat.messages?.[0];

          return {
            chat_id: chat.chat_id,
            other_user_id: otherUser.user_id,
            other_user_name: otherUser.full_name,
            other_user_avatar: otherUser.avatar_url || '/default-avatar.png',
            listing_address: chat.listing_id?.address,
            latest_message: latestMessage ? {
              content: latestMessage.content,
              created_at: latestMessage.created_at
            } : undefined
          };
        });

        setChats(formattedChats);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndChats();
  }, [supabase, router]);

  const handleChatClick = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-4">
        <div className="h-8 w-48 mb-6">
          <Skeleton className="h-full w-full" />
        </div>
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[300px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading chats: {error}
        </div>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 text-center text-gray-500">
          No active chats. Start browsing listings to connect with hosts!
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Chats</h1>
      <div className="space-y-4">
        {chats.map(chat => (
          <Card
            key={chat.chat_id}
            onClick={() => handleChatClick(chat.chat_id)}
            className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition duration-200"
          >
            <div className="relative w-12 h-12 mr-4 flex-shrink-0">
              <Image
                src={chat.other_user_avatar}
                alt={chat.other_user_name}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold truncate">
                  {chat.other_user_name}
                </h2>
                {chat.latest_message && (
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {new Date(chat.latest_message.created_at).toLocaleDateString()}
                  </span>
                )}
              </div>
              {chat.listing_address && (
                <p className="text-sm text-gray-500 truncate">
                  📍 {chat.listing_address}
                </p>
              )}
              {chat.latest_message && (
                <p className="text-sm text-gray-600 truncate mt-1">
                  {chat.latest_message.content}
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ChatsPage;