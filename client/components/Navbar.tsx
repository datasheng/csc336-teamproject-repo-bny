import Link from 'next/link';
import React from 'react'

const Navbar = () => {
    const links = [
        {
            name: "Home",
            link: "/"
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
      <header className="flex justify-between items-center w-full max-w-7xl px-8 py-6 mx-auto">
        <div className="text-2xl font-bold text-black">Real Estate</div>
  
        {/* Navbar Links */}
        <nav className="bg-transparent backdrop-blur-md px-6 py-3 rounded-full shadow-md">
          <ul className="flex space-x-8 text-black font-medium">
            {links.map((link, index) => {
                return <Link href={link.link} key={index}>{link.name}</Link>
            })}
          </ul>
        </nav>
        
        <button className="bg-gray-200 text-black font-bold py-2 px-4 rounded-lg hover:bg-indigo-100">
          <Link href="/login">Login</Link>
        </button>
      </header>
    );
  };
  
  export default Navbar;
