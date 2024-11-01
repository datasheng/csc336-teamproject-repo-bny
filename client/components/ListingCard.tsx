import { StaticImageData } from "next/image";
import Image from "next/legacy/image";
import React from 'react'

interface PropertyCardProps{
    imageUrl: StaticImageData;
    status: string;
    address: string;
    rent: number;
    beds: number;
    baths: number;
    levels: number;
    sqft: number;
}

const ListingCard: React.FC<PropertyCardProps> = ({imageUrl, status, address, rent, beds, baths, levels, sqft}) => {
  return (
    <div className='max-w-sm rounded overflow-hidden shadow-lg border border-gray-200 cursor-pointer transition-transform transform hover:scale-105'>
      <div className="relative">
        <div className="">
            <Image src={imageUrl} alt={address} className='object-cover' width={400} height={300}/>
        </div>

        <span className='absolute top-2 left-2 bgred-600 text-white font-bold px-3 py-1 rounded'>
            {status}
        </span>
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
