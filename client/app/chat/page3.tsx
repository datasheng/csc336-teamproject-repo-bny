"use client"

import React, { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/legacy/image";


export default function ChatsPage() {
  const [chats, setChats] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndChats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      setUser(user);

      const { data, error } = await supabase
        .from('chat')
        .select(`
          chat_id,
          listing_id (address),
          host_id (user_id, full_name, avatar_url),
          roommate_id (user_id, full_name, avatar_url)
        `)
        .or(`host_id.eq.${user.id},roommate_id.eq.${user.id}`);

      if (error) {
        console.error('Error fetching chats:', error);
        setLoading(false);
        return;
      }
      console.log(data)
      const formattedChats = data.map(chat => {
        const isCurrentUser = chat.host_id.user_id === user.id;
        const otherUser = isCurrentUser ? chat.roommate_id : chat.host_id;

        return {
          chat_id: chat.chat_id,
          other_user_id: otherUser.user_id,
          other_user_name: otherUser.full_name,
          other_user_avatar: otherUser.avatar_url || '/default-avatar.png',
          listing_address: chat.listing_id?.address
        };
      })
      setChats(formattedChats);
      setLoading(false);
    };

    fetchUserAndChats();
  }, [supabase, router]);

  const handleChatClick = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  if (loading) return <div>Loading chats...</div>;
  if (chats.length === 0) return <div>No active chats</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Chats</h1>
      <div className="space-y-4">
        {chats.map(chat => (
          <div 
            key={chat.chat_id} 
            onClick={() => handleChatClick(chat.chat_id)}
            className="flex items-center p-4 bg-white shadow rounded-lg cursor-pointer hover:bg-gray-100 transition"
          >
            <div className="relative w-12 h-12 mr-4">
              <Image 
                src={chat.other_user_avatar} 
                alt={chat.other_user_name} 
                layout="fill" 
                objectFit="cover" 
                className="rounded-full"
              />
            </div>
            <div className="flex-grow">
              <h2 className="text-lg font-semibold">{chat.other_user_name}</h2>
              {chat.listing_address && (
                <p className="text-sm text-gray-500">{chat.listing_address}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}