"use client"

import { signout } from '@/lib/auth-actions'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Nav = () => {
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
    ]

    const pathname = usePathname();

    return (
        <nav className='flex gap-8'>
            {links.map((link, index) => {
                return(
                    <Link href={link.path} key={index} className="pt-2">
                        {link.name}
                    </Link>
                )
            })}

            <Link href="/logout" onClick={() => signout()}>
                <img src="https://randomuser.me/api/portraits/men/10.jpg" alt="User" className='w-10 h-10 rounded-full'/>
            </Link>
        </nav>
    )
}

export default Nav
