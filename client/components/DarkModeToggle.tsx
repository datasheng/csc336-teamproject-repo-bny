import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Moon, Sun } from "lucide-react"
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { useTheme } from 'next-themes';

const DarkModeToggle = () => {
  const {theme, setTheme} = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button onClick={toggleTheme} variant="outline" size="icon">
      <Sun className={`h-[1.2rem] w-[1.2rem] transition-transform text-black ${theme === 'dark' ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`} />
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-transform text-white ${theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}`} />
      <span className="sr-only">Toggle Theme</span>
    </Button>
  )
}

export default DarkModeToggle;
