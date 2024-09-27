import Link from 'next/link';
import React from 'react'
import { FaCalendarAlt, FaPhotoVideo, FaSmile, FaVideo } from 'react-icons/fa';

const PostOptions = () => {
    const postOptions= [
        {
            name: "Photo",
            icon: <FaPhotoVideo/>
        },
        {
            name: "Video",
            icon: <FaVideo/>
        },
        {
            name: "Event",
            icon: <FaCalendarAlt/>
        },
        {
            name: "Feeling",
            icon: <FaSmile/>
        },
    ]

  return (
    <div className="mt-4 bg-white p-4 rounded-lg">
        <div className="flex space-x-4 items-center">
            <img src="https://randomuser.me/api/portraits/men/10.jpg" alt="User" className='w-10 h-10 rounded-full'/>
            <input type="text" placeholder='Share your thoughts...' className='flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none'/>
        </div>

        <div className="mt-4 flex justify-between pt-5">
            {postOptions.map((postOption, index) => {
                return(
                    <Link href="/" className='flex items-center space-x-2 text-gray-600' key={index}>
                        {postOption.icon}

                        <span>{postOption.name}</span>
                    </Link>
                )
            })}
        </div>
    </div>
  )
}

export default PostOptions;
