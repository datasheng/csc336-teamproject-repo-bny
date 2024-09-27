import React from 'react'
import Logo from "../public/images/websiteLogo.png"
import Nav from './Nav'
import Link from 'next/link'
import MobileNav from './MobileNav'

const Header = () => {
  return (
    <div className='p-6 flex items-center justify-between'>
      <img src="/images/websiteLogo.png" alt="/images/websiteLogo.png" className='w-10 h-10'/>

      <div className="hidden lg:flex">
        <Nav/>
      </div>

      <div className="lg:hidden">
        <MobileNav/>
      </div>
    </div>
  )
}

export default Header
