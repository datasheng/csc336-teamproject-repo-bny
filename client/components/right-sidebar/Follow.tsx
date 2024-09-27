import Link from 'next/link'
import React from 'react'

const Follow = () => {
    const people = [
        {
            name: "Person 1",
            occuptation: "Software Engineer",
            profileImageUrl: "https://randomuser.me/api/portraits/women/2.jpg",
            profileLink: "",
        },
        {
            name: "Person 2",
            occuptation: "Software Engineer",
            profileImageUrl: "https://randomuser.me/api/portraits/women/2.jpg",
            profileLink: "",
        },
        {
            name: "Person 3",
            occuptation: "Software Engineer",
            profileImageUrl: "https://randomuser.me/api/portraits/women/2.jpg",
            profileLink: "",
        },
    ]

  return (
    <div className='max-w-sm rounded overflow-hidden shadow-lg bg-white p-6 mb-10'>
      <h1 className='font-bold'>Suggested People</h1>

      {people.map((person, index) => {
        return(
            <div className="flex items-center mb-4" key={index}>
                <Link href={person.profileLink} className="flex items-center mb-4">
                    <img src={person.profileImageUrl} alt="" className='rounded-full overflow-hidden w-10 h-10 p-1'/>

                    <div className="ml-2 mt-2">
                        <span className=' font-medium'>{person.name}</span>
                        <span className='block text-sm text-gray-500'>{person.occuptation}</span>
                    </div>
                </Link>
            </div>
        )
      })} 
    </div>
  )
}

export default Follow
