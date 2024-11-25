"use client"

import Listingpage from '@/components/Listingpage';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation';

const ListingsPage = () => {
  const router = useRouter();
  const supabase = createClient();
  const {id} = useParams()

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
    <div className="flex min-h-screen">
      <Listingpage imageUrl={["/placeholder.jpg","/placeholder.jpg" ]} status={"Available"} address={"34-92 54th street"} rent={3423} beds={2} baths={2} levels={2} sqft={1500} description='This house is for rent and I am looking for 3 roommates max' />
    </div>
  )
}

export default ListingsPage;

