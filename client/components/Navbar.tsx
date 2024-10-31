import Link from 'next/link';
import React from 'react'

const Navbar = () => {
    const links = [
        {
            name: "Home",
            link: "/"
        },
        {
            name: "Listings",
            link: "/listings"
        },
        {
            name: "About",
            link: "/about"
        },
        {
            name: "Contact",
            link: "/contact"
        }
    ]

    return (
      <header className="flex justify-between items-center w-full max-w-7xl px-8 py-6 mx-auto text-white">
        <div className="text-4xl font-bold">CoSpace</div>
  
        {/* Navbar Links */}
        <nav className="bg-transparent backdrop-blur-md px-6 py-3 rounded-full border border-white/20 shadow-md">
          <ul className="flex space-x-8 text-white font-medium">
            {links.map((link, index) => {
                return (
                  <li key={index} className="p-2 rounded-lg hover:bg-white hover:text-black transition-colors">
                    <Link href={link.link}>
                      {link.name}
                    </Link>
                  </li>
                )
            })}
          </ul>
        </nav>
        
        <Link href="/login" className="bg-gray-200 text-black font-bold py-2 px-4 rounded-lg hover:bg-indigo-100">Login</Link>
      </header>
    );
  };
  
  export default Navbar;
