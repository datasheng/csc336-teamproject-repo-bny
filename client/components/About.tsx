"use client"
import React from 'react';
import { Button } from "./ui/button";
import Image from "next/legacy/image";
import Header from './Header';
import { FileText, MessageCircle, Shield } from 'lucide-react';

const About = () => {
  return (
    <>
    <Header />
      <div className="my-8 text-center max-w-8xl mx-auto">
        <Image
          src="/images/about.jpg"  
          alt="NYC Skyline"
          width={1200}
          height={400}
          layout="responsive"
          objectFit="cover"
        />
      </div>

      <div className="mx-auto px-12">

        {/* Header Section */}
        <div className="mt-[9rem] max-w-4xl mx-auto text-left">
          <h1 className="text-4xl dark:text-white font-extrabold text-gray-900 mb-4 text-left">About Us</h1>
          <p className="text-xl dark:text-white text-gray-600 text-left mx-auto">
            CoSpace is here to simplify the process of finding a home in New York City. We understand how expensive living in NYC can be, and we're dedicated to making housing more affordable and accessible. Whether you're looking to sell your home, share a space, or rent, CoSpace makes it easy to connect with others and find the perfect fit.
          </p>
        </div>
      </div>

      <div className="mx-auto px-12 bg-[#f2f2f2]">
      {/* How It Works Section */}
      <div className="mt-[9rem] text-left p-16">
        <h2 className="text-3xl font-semibold text-gray-800 text-left mb-8">How It Works</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-24">
          <div className="text-left">
            <FileText className="mx-auto mb-4 text-black" size={100} />
            <h3 className="text-xl font-semibold text-gray-800">Post Your Listing</h3>
            <p className="text-gray-600 mt-4 mx-auto max-w-lg">
              Post your property or room listing in just a few simple steps. Add images, details, and availability for prospective roommates to check out.
            </p>
          </div>

          <div className="text-left">
            <MessageCircle className="mx-auto mb-4 text-black" size={100} />
            <h3 className="text-xl font-semibold text-gray-800">Connect with Roommates</h3>
            <p className="text-gray-600 mt-4 mx-auto max-w-lg">
              Once your listing is live, interested roommates can contact you. Use our messaging feature to communicate and explore options.
            </p>
          </div>

          <div className="text-left">
            <Shield className="mx-auto mb-4 text-black" size={100} />
            <h3 className="text-xl font-semibold text-gray-800">Secure and Transparent</h3>
            <p className="text-gray-600 mt-4 mx-auto max-w-lg">
              Our platform offers secure and transparent processes to make sure both parties feel safe and informed every step of the way.
            </p>
          </div>
        </div>
      </div>
      </div>

      <div className="mx-auto px-12">
        {/* Core Values Section */}
        <div className="mt-[9rem] text-left p-16">
          <h2 className="text-3xl dark:text-white font-semibold text-gray-800 mb-8">Our Core Values</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-20">
            <div>
              <h3 className="text-xl font-semibold dark:text-white text-gray-800">Empathy</h3>
              <p className="text-gray-600 dark:text-white mt-2 mx-auto max-w-lg">
                We strive to understand the needs of others, making sure everyone feels heard, respected, and valued.
              </p>
            </div>

            <div>
              <h3 className="text-xl dark:text-white font-semibold text-gray-800">Innovation</h3>
              <p className="text-gray-600 dark:text-white mt-2 mx-auto max-w-lg">
                We're always looking for new ways to improve our services and provide our users with the best experience.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold dark:text-white text-gray-800">Integrity</h3>
              <p className="text-gray-600 dark:text-white mt-2 mx-auto max-w-lg">
                We believe in honesty and transparency in everything we do, ensuring trust with every user interaction.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-16 bg-gray-100 py-8 text-center px-6 sm:px-8 lg:px-12">
        <p className="text-gray-600">© 2024 CoSpace. All rights reserved.</p>
      </footer>
    </>
  );
};

export default About;
