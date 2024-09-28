import React from 'react'
import Logo from "../public/images/linkdup_logo.png"
import Nav from './Nav'
import Link from 'next/link'
import MobileNav from './MobileNav'

const Header = () => {
  return (
    <div className='p-6 flex items-center justify-between'>
      <img src="/images/linkdup_logo.png" alt="/images/linkdup_logo.png" className='h-10'/>

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
