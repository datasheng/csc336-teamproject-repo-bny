"use client"

import Listingpage from '@/components/Listingpage';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const ListingsPage = () => {
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
    <>
    </>
  )
}

export default ListingsPage;

