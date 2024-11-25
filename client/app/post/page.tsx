"use client"

import PostListing from '@/components/PostListing';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const ListPage = () => {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async() => {
      const {data: {session} } = await supabase.auth.getSession();
      
      if(!session){
        router.push('/login');
      };
    };

    checkUser();
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <PostListing/>
    </div>
  )
}

export default ListPage;
