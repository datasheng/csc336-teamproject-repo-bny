import React from 'react'

const SearchBar = () => {
  return (
    <div className="flex justify-center mt-8 mb-6">
      <input type="text" placeholder="Search for a property..." className="max-w-4xl px-4 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
    </div>
  )
}

export default SearchBar;
