import { signout } from '@/lib/auth-actions';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import DarkModeToggle from './DarkModeToggle';
import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut } from './ui/dropdown-menu';
import {LogOutIcon, Settings, User} from "lucide-react";
import { FaMessage } from "react-icons/fa6";

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

const Navbar = () => {
  const supabase = createClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();
  const [isDropdownOpen, setIsDropDownOpen] = useState(false);

  const toggleDropdown = () => setIsDropDownOpen(!isDropdownOpen);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        const name = session.user.user_metadata?.username || session.user.email; // Use name if available, otherwise email
        setUserName(name);
        setIsLoggedIn(true);
      } else {
        setUserName(null);
      }
    };

    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        checkUser();
        router.refresh(); 
      } else if (event === "SIGNED_OUT") {
        setUserName(null);
        router.refresh();
      }
    });

    return () => listener?.subscription.unsubscribe();
  }, [userName])

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
      
      <div className="">
        <div className="flex items-center space-x-4">
          <DarkModeToggle/>

          {isLoggedIn && userName ? (
            <>
              <div className="bg-white text-black dark:bg-black dark:text-white rounded-md p-3 cursor-pointer">
                <Link href="/chat">
                  <FaMessage/>
                </Link>
              </div>

              <DropdownMenu >
                <DropdownMenuTrigger asChild>
                  <button onClick={toggleDropdown} className="bg-gray-200 dark:bg-black dark:text-white text-black font-bold py-2 px-4 rounded-lg hover:bg-indigo-200">
                    {userName}
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className='w-56'>
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuSeparator/>

                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <User/>
                      <span>Profile</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <Settings/>
                      <span>Settings</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <LogOutIcon/>
                      <Link href="/logout" onClick={() => signout()}>Logout</Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/login" className="bg-gray-200 dark:bg-black dark:text-white text-black font-bold py-2 px-4 rounded-lg hover:bg-indigo-200">
              Login
            </Link>
          )}
        
        </div>
      </div>
    </header>
  );
};
  
export default Navbar;
