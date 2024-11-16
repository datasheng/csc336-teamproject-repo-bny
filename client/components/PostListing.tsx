"use client"

import React, { useState } from 'react'
import { Button } from './ui/button';
import ListingCard from './ListingCard';
import { FileUpload } from './ui/file-upload';
import useUser from '@/utils/useUser';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

const labels = [
  {id: "title", name: "Title", type: "text"},
  {id: "description", name: "Description", type: "text"},
  {id: "address", name: "Address", type: "text"},
  {id: "status", name: "Status", type: "text"},
  {id: "rent", name: "Rent", type: "number"},
  {id: "max_roommates", name: "Max Roommates", type: "number"},
  {id: "beds", name: "Bedrooms", type: "number"},
  {id: "baths",name: "Bathrooms", type: "number"},
  {id: "levels", name: "Levels", type: "number"},
  {id: "sqft",name: "Square Feet",type: "number"},
]

const PostListing = () => {
  const [formData, setFormData] = useState({
    status: 'Looking',
    address: "",
    rent: 0,
    max_roommates: 0,
    beds: 0,
    baths: 0,
    levels: 1,
    sqft: 0,
  });

  const [files, setFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const user = useUser();
  const supabase = createClient();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {id, value} = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [id]: id === 'rent' || id === 'sqft' || id === 'bedrooms' || id === 'bathrooms' || id === 'levels' ? parseInt(value) : value,
    }));
  }

  const handleFileUpload = (uploadFiles: File[]) => {
    const updatedFiles = [...files, ...uploadFiles];
    setFiles(updatedFiles);

    const previews = updatedFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  }

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    if(!user){
      alert("You must be logged in to create a listing");
      return;
    }

    setLoading(true);

    try{
      const {data: listingData, error} = await supabase.from('listings').insert({
        ...formData,
        author_id: user.id
      })

      if(error){
        console.error("Error inserting data: ", error);
        alert("Failed to create listing");
      }
        
      alert("Listing created successfully");
      // router.push('/')
    }catch(err) {
      console.error("Error submitting form: ", err);
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="flex">
      <form className="flex-1 p-4 w-[600px]" onSubmit={handleSubmit}>
        <h2 className='text-2xl font-semibold mb-4 dark:text-white'>Create New Listing</h2>

        {labels.map((label, index) => {
          return(
            <div className="mb-4" key={index}>
              <label htmlFor={label.id} className="block text-sm font-medium text-gray-700 dark:text-white">{label.name}</label>
              <input type={label.type} id={label.id} name={label.id} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:text-white" onChange={handleInputChange}/>
            </div>
          )
        })}

        <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
          <FileUpload onChange={handleFileUpload}/>
        </div>
        
        <Button type='submit' className="w-full dark:bg-white text-white py-2 rounded-md hover:bg-blue-800 dark:text-black" disabled={loading}>
          {loading ? 'Creating Listing...' : 'Create New Listing'}
        </Button>
      </form>

      <div className="max-w-lg w-full p-4 ml-4  rounded-md shadow-md">
        <h2 className='text-2xl font-semibold mb-4 dark:text-white'>Listing Preview</h2>

        <ListingCard imageUrl={imagePreviews || "/placeholder.jpg"} status={formData.status} address={formData.address} rent={formData.rent} beds={formData.beds} baths={formData.baths} levels={formData.levels} sqft={formData.sqft}/>
      </div>
    </div>
  )
}

export default PostListing;
