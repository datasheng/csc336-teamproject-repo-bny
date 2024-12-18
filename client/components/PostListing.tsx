"use client"

import React, { useState } from 'react'
import { Button } from './ui/button';
import ListingCard from './ListingCard';
import { FileUpload } from './ui/file-upload';
import useUser from '@/utils/useUser';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import {v4 as uuidv4} from 'uuid';

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
  const [predictedRent, setPredictedRent] = useState<number | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
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
      }).select('listing_id')

      if(error){
        console.error("Error inserting data: ", error);
        alert("Failed to create listing");
      }

      const listingID = listingData[0]?.listing_id;

      const photoInsert = files.map(async(file) => {
        const {data: storageData, error: storageError} = await supabase.storage.from('listing-photos')
          .upload(`${listingID}` + "/" + uuidv4(), file)

        if(storageError){
          console.error("Error uploading file: ", storageError);
          return null
        }

        const {publicURL} = supabase.storage.from('listing-photos').getPublicUrl(storageData.path);

        const {error: photoError} = supabase.from('listing_photos').insert({
          listing_id: listingID,
          image_url: publicURL,
        });

        if(photoError){
          console.error('Error inserting photo: ', photoError);
          return null;
        }

        return publicURL;
      })

      const uploadedPhotos = await Promise.all(photoInsert);

      if(uploadedPhotos.includes(null)){
        alert("Some photos were not uploaded")
      }else{
        alert("Listing created successfully");
        router.push('/listings')
      }
    }catch(err) {
      console.error("Error submitting form: ", err);
    }finally{
      setLoading(false);
    }
  }

  const handlePredict = async () => {
    setIsPredicting(true);

    //find long and lat of address
    //without google maps api
    const geocodeAddress = async (address: string) => {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        console.log(data[0].lat);
      return {
        lat: data[0].lat,
        lon: data[0].lon,
      };
      } else {
        return {
          lat: 40.7282,
          lon: -73.7949,
        };
      }
    };

    const { lat, lon } = await geocodeAddress(formData.address)

    if (!formData.sqft || !lat || !lon || !formData.beds || !formData.baths) {
      alert('Please fill out all required fields');
      setIsPredicting(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sqfeet: formData.sqft,
          lat: lat,
          long: lon,
          beds: formData.beds,
          baths: formData.baths,
        })
      });
      const data = await response.json();
      setPredictedRent(data.prediction/formData.max_roommates);
    } catch (error) {
      console.error('Prediction failed:', error);
      alert('Failed to get rent prediction');
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="flex">
      <form className="flex-1 p-4 w-[600px]" onSubmit={handleSubmit}>
        <h2 className='text-2xl font-semibold mb-4 dark:text-white'>Create New Listing</h2>

        {labels.map((label, index) => {
          if (label.id === 'rent') {
            return (
              <div className="mb-4" key={index}>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label htmlFor={label.id} className="block text-sm font-medium text-gray-700 dark:text-white">
                      {label.name}
                    </label>
                    <input 
                      type={label.type} 
                      id={label.id} 
                      name={label.id} 
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:text-white" 
                      onChange={handleInputChange}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handlePredict}
                    disabled={isPredicting}
                    className="mt-6"
                  >
                    {isPredicting ? 'Predicting...' : 'Predict Rent'}
                  </Button>
                </div>
                {predictedRent !== null && (
                  <div className="mt-2 p-3 bg-green-50 dark:bg-green-900 rounded-md">
                    <p className="text-sm font-medium text-green-800 dark:text-green-100">
                      Predicted Rent Per Roommate: ${predictedRent.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-200 mt-1">
                      This is an AI prediction based on your listing details
                    </p>
                  </div>
                )}
              </div>
            );
          }
          return (
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
