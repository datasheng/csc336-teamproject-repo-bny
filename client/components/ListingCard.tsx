"use client"

import Image from "next/legacy/image";
import React, { useState } from 'react'

interface PropertyCardProps{
    imageUrl: string[];
    status: string;
    address: string;
    rent: number;
    beds: number;
    baths: number;
    levels: number;
    sqft: number;
}

const ListingCard: React.FC<PropertyCardProps> = ({imageUrl, status, address, rent, beds, baths, levels, sqft}) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  const handleNext = () => {
    setCurrentIdx((prevIdx) => (prevIdx + 1) % imageUrl.length);
    console.log(imageUrl);
  };

  const handlePrev = () => {
    setCurrentIdx((prevIdx) => prevIdx === 0 ? imageUrl.length - 1 : prevIdx - 1);
  }

  return (
    <div className='max-w-sm rounded overflow-hidden shadow-lg border border-gray-200 cursor-pointer transition-transform transform hover:scale-105'>
      <div className="relative">
        {imageUrl.length > 0 ? (
          <Image src={imageUrl[currentIdx]} alt={`{Image ${currentIdx  + 1}}`} className="object-cover w-full h-full" width={400} height={300} fill priority/>
        ) : (
          <Image src='/placeholder.jpg' alt="PlaceHolder" className="object-fill" width={400} height={300} priority/>
        )}

        <span className='absolute top-2 left-2 bgred-600 text-white font-bold px-3 py-1 rounded'>
            {status}
        </span>
        
        {imageUrl.length > 0 && (
          <>
            <button className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full shadow-lg hover:bg-gray-800 focus:outline-none" onClick={handlePrev}>&larr;</button>
            <button className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full shadow-lg hover:bg-gray-800 focus:outline-none" onClick={handlePrev}>&rarr;</button>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-gray-900 bg-opacity-75 px-3 py-1 rounded">
              {currentIdx + 1} / {imageUrl.length}
            </div>
          </>
        )}
      </div>

      <div className="p-4">
        <h2 className='text-2xl font-semibold'>{address}</h2>
        <p className='text-lg font-bold mt-2'>${rent}</p>
      </div>

      <div className="border-t border-gray-200 my-2 mx-4"></div>

      <div className="flex justify-between px-4 pb-4 text-center text-gray-700 dark:text-white">
        <div className="">
            <p className='text-sm'>Beds</p>
            <p className='font-semibold'>{beds}</p>
        </div>

        <div className="">
            <p className='text-sm'>Baths</p>
            <p className='font-semibold'>{baths}</p>
        </div>

        <div className="">
            <p className='text-sm'>Levels</p>
            <p className='font-semibold'>{levels}</p>
        </div>

        <div className="">
            <p className='text-sm'>Sqft</p>
            <p className='font-semibold'>{sqft}</p>
        </div>
      </div>
    </div>
  )
}

export default ListingCard;