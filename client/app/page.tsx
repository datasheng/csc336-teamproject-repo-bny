"use client"

import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import bg from "@/public/images/homepageBackground.jpeg"
import Image from "next/image";
import Link from "next/link";
import { BsHouseAddFill } from "react-icons/bs";
import { FaHouseUser } from "react-icons/fa";

export default function Home() {
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

  return (
    <div className="min-h-screen bg-cover bg-no-repeat" style={{backgroundImage: `url(${bg.src})`, imageRendering: "auto"}}>
      <Navbar/>

      <div className="flex flex-col items-center justify-center h-[calc(50vh-80px)] px-6">
        <h1 className="text-8xl font-bold text-white">Welcome to CoSpace</h1>
        <h2 className="mt-4 text-4xl text-white">Your space to find cheaper rent</h2>
        
        <SearchBar/>
      </div>

      <div className="flex justify-center space-x-6">
        {cards.map((card, index) => {
          return(
            <Link href={card.link} key={index} className=" bg-white flex flex-col mr-20 items-center justify-center mb-10 p-8 w-60 h-48 rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-105 hover:bg-blue-500">
              {card.icon}
              <h3 className="mt-4 text-xl font-semibold">{card.title}</h3>

              <div className="bg-gray-200 text-black-600 rounded-full p-2">
                <span>→</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  );
}
