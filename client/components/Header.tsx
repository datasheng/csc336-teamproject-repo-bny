import React from 'react'
import Navbar from './Navbar';
import MobileNav from './MobileNav';

const Header = () => {
  return (
    <header className='py-8 xl:py-1 text-white'>
        <div className="hidden lg:flex items-center gap-8">
            <Navbar/>
        </div>

      <div className="xl:hidden">
        <MobileNav/>
      </div>
    </header>
  )
}

export default Header;
