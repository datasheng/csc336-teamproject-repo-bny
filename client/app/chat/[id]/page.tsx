"use client"
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, UserPlus } from "lucide-react";
import Image from "next/legacy/image";
import { toast } from "sonner";
import Header from '@/components/Header';
import { Badge } from '@/components/ui/badge';

interface Message {
  message_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface ChatProps {
  params: {
    id: string;  // This is the chat_id
  }
}

const ChatInterface = ({ params: { id } }: ChatProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentUserId, setCurrentUserId] = useState("");
    const [recipientId, setRecipientId] = useState("");
    const [recipientName, setRecipientName] = useState("");
    const [userAvatar, setUserAvatar] = useState("");
    const [recipientAvatar, setRecipientAvatar] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [listingId, setListingId] = useState<string | null>(null);
    const [isMatchPending, setIsMatchPending] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [matchStatus, setMatchStatus] = useState<string | null>(null);
    const supabase = createClient();
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const getInfo = async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUserId(user.id);

      // Get chat details and recipient ID
      const { data: chatData } = await supabase
        .from('chat')
        .select('host_id, roommate_id, listing_id')
        .eq('chat_id', id)
        .single();

      if (chatData) {
        const recipientId = chatData.host_id === user.id ? chatData.roommate_id : chatData.host_id;
        setRecipientId(recipientId);
        setListingId(chatData.listing_id);

        // Check if current user is host
        setIsHost(chatData.host_id === user.id);

        // If host, check for pending matches
        if (chatData.host_id === user.id && chatData.listing_id) {
          const { data: matchData } = await supabase
            .from('matches')
            .select('match_status')
            .eq('listing_id', chatData.listing_id)
            .eq('user_id', recipientId)
            .single();

          setMatchStatus(matchData?.match_status || null);
        }

        // Check if match is already pending
        if (chatData.listing_id) {
          const { data: matchData } = await supabase
            .from('matches')
            .select('match_status')
            .eq('listing_id', chatData.listing_id)
            .eq('user_id', user.id)
            .single();

          setIsMatchPending(matchData?.match_status === 'pending');
        }

        // Get messages
        const { data: messagesData } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', id)
          .order('created_at', { ascending: true });

        if (messagesData) {
          setMessages(messagesData);
        }

        console.log(recipientId);

        // Get recipient details
        const { data: recipientData } = await supabase.from("user").select("full_name, avatar_url").eq("user_id", recipientId).single()

          console.log(recipientData);

        if (recipientData) {
          setRecipientName(recipientData.full_name);
          setRecipientAvatar(recipientData.avatar_url || '/default-avatar.png');
        }

        // Get current user avatar
        const { data: userData } = await supabase
          .from('user')
          .select('avatar_url')
          .eq('user_id', user.id)
          .single();

        if (userData) {
          setUserAvatar(userData.avatar_url || '/default-avatar.png');
        }
      }
    };

    getInfo();
  }, [id, supabase]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages(prev => [...prev, payload.new as Message]);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [id, supabase]);

  const sendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newMessage.trim()) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        chat_id: id,
        sender_id: currentUserId,
        recipient_id: recipientId,
        content: newMessage,
      });

    if (!error) {
      setNewMessage('');
    } else {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleMatch = async () => {
    if (!listingId || !currentUserId) return;

    try {
      const { error } = await supabase
        .from('matches')
        .insert({
          listing_id: listingId,
          user_id: currentUserId,
          match_status: 'pending'
        });

      if (error) throw error;

      setIsMatchPending(true);
      toast.success("Match request sent!");
    } catch (error) {
      console.error('Error creating match:', error);
      toast.error("Failed to send match request");
    }
  };

  const handleMatchAction = async (action: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('matches')
        .update({ match_status: action })
        .eq('listing_id', listingId)
        .eq('user_id', recipientId);

      if (error) throw error;

      setMatchStatus(action);
      toast.success(`Match ${action} successfully!`);
    } catch (error) {
      console.error('Error updating match:', error);
      toast.error('Failed to update match status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <Header/>
      <div className='max-w-3xl mx-auto rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-gray-800 h-[calc(100vh-2rem)] border border-gray-700'>
        {/* Chat Header */}
        <div className="p-6 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative h-12 w-12">
                {recipientAvatar ? (
                  <Image
                    src={recipientAvatar}
                    alt={recipientName}
                    layout="fill"
                    className="rounded-full ring-2 ring-gray-700"
                    objectFit="cover"
                  />
                ) : (
                  <div className="h-12 w-12 bg-gray-700 rounded-full" />
                )}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800"></div>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-gray-100">{recipientName}</h2>
                <p className="text-sm text-gray-400">Active now</p>
              </div>
            </div>
            {isHost && matchStatus === 'pending' ? (
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleMatchAction('accepted')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Accept Match
                </Button>
                <Button
                  onClick={() => handleMatchAction('rejected')}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Reject Match
                </Button>
              </div>
            ) : (
              matchStatus && (
                <Badge className={`${
                  matchStatus === 'accepted' ? 'bg-green-100 text-green-800' : 
                  matchStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  Match {matchStatus}
                </Badge>
              )
            )}
            {listingId && (
              <Button
                onClick={handleMatch}
                disabled={isMatchPending}
                className={`${
                  isMatchPending 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700'
                } text-white shadow-lg transition-colors duration-200`}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {isMatchPending ? 'Match Pending' : 'Match'}
              </Button>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-900" style={{ height: 'calc(100% - 160px)' }}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.message_id}
                className={`flex ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end space-x-2 ${message.sender_id === currentUserId ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                  <div className="relative h-8 w-8">
                    <Image
                      src={message.sender_id === currentUserId ? userAvatar : recipientAvatar}
                      alt="avatar"
                      layout="fill"
                      className="rounded-full ring-2 ring-gray-700"
                      objectFit="cover"
                    />
                  </div>
                  <div 
                    className={`max-w-xs px-4 py-2 rounded-lg shadow-md ${
                      message.sender_id === currentUserId 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-800 text-gray-100'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender_id === currentUserId 
                        ? 'text-red-200' 
                        : 'text-gray-400'
                    }`}>
                      {new Date(message.created_at).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="px-6 py-4 border-t border-gray-700 bg-gray-800">
          <form onSubmit={sendMessage} className="flex space-x-4">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400 focus:ring-red-500 focus:border-red-500"
            />
            <Button 
              type="submit" 
              disabled={!newMessage.trim()}
              className="bg-red-600 hover:bg-red-700 text-white shadow-lg transition-colors duration-200"
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;