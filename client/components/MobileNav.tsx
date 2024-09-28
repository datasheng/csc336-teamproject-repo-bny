"use client"

import React, { useState } from 'react'
import { RxHamburgerMenu } from 'react-icons/rx'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { CiMenuFries } from 'react-icons/ci'
import Link from 'next/link'

const MobileNav = () => {
  const links = [
    {
        name: "Home",
        path: "/"
    },
    {
        name: "Explore",
        path: "/"
    },
    {
        name: "Messages",
        path: "/",
    },
    {
        name: "Notifcations",
        path: "/"
    },
    {
      name: "Profile",
      path: "/"
    }
]

  return (
    <Sheet>
      <SheetTrigger>
        <CiMenuFries className='text-[32px]'/>
      </SheetTrigger>

      <SheetContent className='flex flex-col lg:hidden'>
        <nav className='flex flex-col justify-center items-center gap-8'>
          {links.map((link, index) => {
            return (
              <Link href={link.path} key={index} className="flex justify-center items-center w-full text-center py-4">
                {link.name}
              </Link>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

export default MobileNav
