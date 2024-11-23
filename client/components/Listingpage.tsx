"use client"
import Image from "next/legacy/image";
import React, { useState } from 'react';
import { Button } from "./ui/button";

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
}

const Listingpage: React.FC<PropertyCardProps> = ({
  imageUrl, 
  status, 
  address, 
  rent, 
  beds, 
  baths, 
  levels, 
  sqft,
  description
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  const handleNext = () => {
    setCurrentIdx((prevIdx) => (prevIdx + 1) % imageUrl.length);
  };

  const handlePrev = () => {
    setCurrentIdx((prevIdx) => prevIdx === 0 ? imageUrl.length - 1 : prevIdx - 1);
  };

  return (
    <div className='w-full rounded-lg overflow-hidden shadow-lg  hover:shadow-xl transition-shadow m-16'>
      <div className="flex flex-col md:flex-row">
        {/* Left side - Images */}
        <div className="md:w-1/2 relative h-[400px]">
          {imageUrl.length > 0 ? (
            <Image 
              src={imageUrl[currentIdx]} 
              alt={`Image ${currentIdx + 1}`} 
              layout="fill"
              objectFit="cover"
              priority
            />
          ) : (
            <Image 
              src='/placeholder.jpg' 
              alt="PlaceHolder" 
              layout="fill"
              objectFit="cover"
              priority
            />
          )}
          
          <span className='absolute top-4 left-4 bg-red-600 text-white font-bold px-4 py-2 rounded'>
            {status}
          </span>

          {imageUrl.length > 0 && (
            <>
              <button 
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-700 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 focus:outline-none" 
                onClick={handlePrev}
              >
                &larr;
              </button>
              <button 
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-700 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 focus:outline-none" 
                onClick={handleNext}
              >
                &rarr;
              </button>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-gray-900 bg-opacity-75 px-4 py-2 rounded">
                {currentIdx + 1} / {imageUrl.length}
              </div>
            </>
          )}
        </div>

        {/* Right side - Property Info */}
        <div className="md:w-1/2 p-6">
          <div className="flex flex-row">
            <h2 className='text-3xl flex flex-start font-semibold mb-4'>{address}</h2>
            <Button className="ml-72">Message</Button>
          </div>
          <p className='text-2xl font-bold text-red-600 mb-6'>${rent.toLocaleString()}/month</p>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <p className='text-gray-600'>Beds</p>
              <p className='text-xl font-semibold'>{beds}</p>
            </div>
            <div className="text-center">
              <p className='text-gray-600'>Baths</p>
              <p className='text-xl font-semibold'>{baths}</p>
            </div>
            <div className="text-center">
              <p className='text-gray-600'>Levels</p>
              <p className='text-xl font-semibold'>{levels}</p>
            </div>
            <div className="text-center">
              <p className='text-gray-600'>Sqft</p>
              <p className='text-xl font-semibold'>{sqft.toLocaleString()}</p>
            </div>
          </div>

          {/* Description section */}
          {description && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Description</h3>
              <p className="text-white leading-relaxed">{description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listingpage;