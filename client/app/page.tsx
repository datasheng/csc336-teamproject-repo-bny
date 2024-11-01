"use client"

import ListingCard from "@/components/ListingCard";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import lightBg from "@/public/images/homepageBackground.jpeg";
import darkBg from "@/public/images/homePageBackgroundImageDark.jpg";
import property1 from "@/public/images/propertyImages/property1.jpg"
import property2 from "@/public/images/propertyImages/property2.jpg"
import property3 from "@/public/images/propertyImages/property3.jpg"
import property4 from "@/public/images/propertyImages/property4.jpg"
import property5 from "@/public/images/propertyImages/property5.jpg"
import { useTheme } from "next-themes";
import Image from "next/legacy/image";
import Link from "next/link";
import { BsHouseAddFill } from "react-icons/bs";
import { FaHouseUser } from "react-icons/fa";

const cards = [
  { 
    title: "List a property", 
    icon: <BsHouseAddFill size={48}/>, 
    link: "/list"
  },
  { 
    title: "Find a place", 
    icon: <FaHouseUser size={48}/>, 
    link: "listings"
  }
]

const dummyProperties = [
  {
    imageUrl: property1,
    status: "Looking",
    address: '17081 Perry Street',
    location: 'San Francisco, CA, USA',
    rent: 3000,
    beds: 4,
    baths: 2,
    levels: 3,
    sqft: 1234,
  },
  {
    imageUrl: property2,
    status: 'Not Looking',
    address: '2134 Maple Avenue',
    location: 'Los Angeles, CA, USA',
    rent: 2500,
    beds: 3,
    baths: 2,
    levels: 2,
    sqft: 980,
  },
  {
    imageUrl: property3,
    status: 'Looking',
    address: '789 Willow Lane',
    location: 'Seattle, WA, USA',
    rent: 2700,
    beds: 3,
    baths: 2,
    levels: 1,
    sqft: 1500,
  },
  {
    imageUrl: property4,
    status: 'Looking',
    address: '305 Elm St',
    location: 'Austin, TX, USA',
    rent: 3500,
    beds: 5,
    baths: 3,
    levels: 2,
    sqft: 2100,
  },
  {
    imageUrl: property5,
    status: 'Not Looking',
    address: '456 Oak Avenue',
    location: 'Chicago, IL, USA',
    rent: 1800,
    beds: 2,
    baths: 1,
    levels: 1,
    sqft: 850,
  },
]

export default function Home() {
  const {theme} = useTheme();
  const bgImage = theme === "dark" ? darkBg.src : lightBg.src;

  return (
    <div className="">
      <div className="min-h-screen bg-cover bg-no-repeat" style={{backgroundImage: `url(${bgImage})`}}>
        <Navbar/>

        <div className="flex flex-col items-center justify-center h-[calc(50vh-80px)] px-6">
          <h1 className="text-8xl font-bold text-white">Welcome to CoSpace</h1>
          <h2 className="mt-4 text-4xl text-white">Your space to find cheaper rent</h2>
          
          <SearchBar/>
        </div>

        <div className="flex justify-center space-x-6">
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

      <div className="flex flex-col items-center mt-8">
        <h1 className="text-6xl font-bold">Listings</h1>

        <div className="grid grid-cols-1 md:grids-cols-2 lg:grid-cols-3 gap-8 mt-12 mb-10">
          {dummyProperties.map((property, index) => {
            return(
              <ListingCard key={index} {...property}/>
            )
          })}
        </div>
      </div>
    </div>
  );
}
