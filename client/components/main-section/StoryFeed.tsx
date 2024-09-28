import React from 'react'

const StoryFeed = () => {
    const stories = [
        { name: 'Judy Nguyen', image: 'https://randomuser.me/api/portraits/women/8.jpg' },
        { name: 'Judy Nguyen', image: 'https://randomuser.me/api/portraits/women/8.jpg' },
        { name: 'Amanda Reed', image: 'https://randomuser.me/api/portraits/women/2.jpg' },
        { name: 'Billy Bob', image: 'https://randomuser.me/api/portraits/men/3.jpg' },
    ];

    return (
        <div className='w-full p-4 bg-white rounded-lg shadow-lg'>
            <div className="flex space-x-4 overflow-x-auto">
                <div className="flex flex-col items-center justify-center w-24 h-36 border border-dashed border-gray-300 rounded-lg p-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full text-gray-500">+</div>

                    <p className='mt-2 text-center text-xs sm:text-sm text-gray-500'>
                        Post a Story
                    </p>
                </div>

                <div className="flex space-x-4 overflow-x-auto w-full">
                    {stories.map((story, index) => {
                        return(
                            <div className="relative w-20 h-32 sm:w-24 sm:h-36" key={index}>
                                <img src={story.image} alt={story.name} className='w-full h-36 object-cover rounded-lg'/>

                                <div className="absolute bottom-0 w-full text-center bg-black bg-opacity-50 rounded-b-lg p-1">
                                    <p className='text-xs text-white'>
                                        {story.name}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default StoryFeed
