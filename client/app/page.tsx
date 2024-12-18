"use client"

import SearchBar from "@/components/SearchBar";
import lightBg from "@/public/images/homepageBackground.jpeg";
import darkBg from "@/public/images/homePageBackgroundImageDark.jpg";
import { useTheme } from "next-themes";
import Link from "next/link";
import { BsHouseAddFill } from "react-icons/bs";
import { FaHouseUser } from "react-icons/fa";
import { motion } from 'framer-motion';
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const cards = [
  { 
    title: "List a property", 
    icon: <BsHouseAddFill size={48}/>, 
    link: "/post"
  },
  { 
    title: "Find a place", 
    icon: <FaHouseUser size={48}/>, 
    link: "/listings"
  }
]

export default function Home() {
  const [bgImage, setBgImage] = useState('');
  const [listings, setListings] = useState<any[]>([]);
  const {theme} = useTheme();
  const supabase = createClient();
  
  useEffect(() => {
    const fetchListings = async() => {
      const {data, error} = await supabase.from('listings').select('listing_id, title, description, address, status, rent, max_roommates, beds, baths, levels, sqft').order('created_at', {ascending: false})

      if(error){
        console.error('Error fetching listings: ', error);
      }else{
        setListings(data || [])
      }
    }

    fetchListings();
  }, [supabase])

  useEffect(() => {
    const bgImage = theme === "dark" ? darkBg.src : lightBg.src;
    setBgImage(bgImage);
  })

  return (
    <div className="">
      <div className="min-h-screen bg-cover bg-no-repeat md:w-full" style={{backgroundImage: `url(${bgImage})`}}>
        <Header/>

        <div className="flex flex-col items-center justify-center h-[calc(50vh-80px)] px-6">
          <motion.h1 className="lg:text-7xl sm:text-5xl phone:text-4xl font-bold text-white" initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5}}>
            Welcome to CoSpace
          </motion.h1>
          
          <motion.h2 className="mt-4 text-4xl sm:text-2xl phone:text-2xl text-white" initial={{opacity: 0, x: -20}} animate={{opacity: 1, x: 0}} transition={{duration: 0.5}}>
            Your space to find cheaper rent
          </motion.h2>
          
            <div className="mt-8 w-full max-w-4xl flex justify-center">
              <SearchBar/>
            </div>
        </div>

        <div className="hidden xl:flex justify-center space-x-6">
          {cards.map((card, index) => {
            return(
              <Link href={card.link} key={index} className="bg-white dark:bg-black flex flex-col mr-20 items-center justify-center mb-10 p-8 w-60 h-48 rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-105 hover:bg-blue-500">
                {card.icon}
                <h3 className="mt-4 text-xl font-semibold">{card.title}</h3>

                <div className="bg-white dark:bg-black text-black-600 rounded-full p-2">
                  <span>→</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  );
}
