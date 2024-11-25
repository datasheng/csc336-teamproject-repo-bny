"use client"

import React from 'react';
import { useParams, usePathname } from 'next/navigation';
import useUser from '@/utils/useUser';
import Header from '@/components/Header';

const UserPage = () => {
  const pathname = usePathname(); // Get the full URL path
  const userName = pathname.split('/').pop();
  const user = useUser(); 
  const isOwner = user?.user_metadata?.username === userName;

  return (
    <div className="flex flex-col justify-center items-center">
      <Header/>

      {isOwner ? (
        <div className="">
          <p>Welcome to your profile!</p>
        </div>
      ) : (
        <p>Viewing {userName}'s profile.</p>
      )}
    </div>
  );
};

export default UserPage;
