"use client"
import React from 'react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { CiMenuFries} from 'react-icons/ci'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

const MobileNav = () => {
    const pathname = usePathname();

    return (
        <Sheet>
            <div className="relative flex items-center justify-between">
                <h1 className='text-4xl ml-8'>CoSpace</h1>

                <SheetTrigger className="flex justify-center items-center mr-5">
                    <CiMenuFries className="text-[32px] dark:text-white" />
                </SheetTrigger>
            </div>

            <SheetContent className='flex flex-col'>
                <div className="mt-32 mb-20 text-center text-2xl">
                    <Link href="/">
                        <h1 className='text-4xl font-semibold'>CoSpace</h1>
                    </Link>
                </div>

                <div className='flex flex-col space-y-2 items-center'>
                    {links.map((link, index) => {
                        return (
                            <Link href={link.link} key={index} className='block text-3xl text-white hover:underline p-5 rounded-md transition-all, duration-200'>
                                {link.name}
                            </Link> 
                        )
                    })}
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default MobileNav;
