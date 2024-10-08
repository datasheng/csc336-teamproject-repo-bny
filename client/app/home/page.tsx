"use client";

import Header from '@/components/Header';
import Profile from '@/components/left-sidebar/Profile';
import PostOptions from '@/components/main-section/PostOptions';
import StoryFeed from '@/components/main-section/StoryFeed';
import Nav from '@/components/Nav';
import Follow from '@/components/right-sidebar/Follow';
import News from '@/components/right-sidebar/News';
import { login } from '@/lib/auth-actions';
import { createClient } from '@/utils/supabase/client';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserSession = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if(!user){
        router.push('/login');
      }else{
        setLoading(false);
      }
    }

    checkUserSession();
  }, [router]);

  if(loading){
    return(
      <div className="">Loading...</div>
    )
  }

  return (
    <div className="">
      <Header/>

      <div className="grid-cols-1 bg-gray-100 lg:grid lg:grid-cols-4 gap-10 p-4 min-h-screen">
        <div className="row-span-3">
          <Profile />
        </div>
        <div className="col-span-2">
          <StoryFeed />
          <PostOptions />
        </div>
        <div className="sm:row-span-3">
          <Follow />
          <News />
        </div>
      </div>
    </div>
  );
};

export default Home;
