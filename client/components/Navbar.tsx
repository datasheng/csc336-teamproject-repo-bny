import { signout } from '@/lib/auth-actions';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

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

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        const name = session.user.user_metadata?.username || session.user.email; // Use name if available, otherwise email
        setUserName(name);
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
        
      <Link href={isLoggedIn ? "/profile" : "/login"} className="bg-gray-200 text-black font-bold py-2 px-4 rounded-lg hover:bg-indigo-100">
        {userName || "Login"}
      </Link>
    </header>
  );
};
  
export default Navbar;
