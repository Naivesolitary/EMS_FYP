import React from 'react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function NavMenu() {
    const navState = ( {isActive} ) => `font-medium border-b-2 transition duration-300 ${
    isActive ? 'border-red-600' : 'border-transparent hover:border-green-400'
  }`
//  const [navState , setNavState] = useState('');
  

    return (
        <nav className="bg-white py-4 px-6 border-b border-gray-200 ">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-black">Evenera</h1>
          </div>
          <div className="hidden md:flex space-x-6">
            <NavLink to="/"  className={navState}   ><span>Home</span></NavLink>
            <NavLink to="/events" className={navState}>Events</NavLink>
            <NavLink to="/about" className={navState}>About</NavLink>
            <NavLink to="/contact" className={navState}>Contact</NavLink>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-black font-medium">Login</button>
            <button className="bg-black text-white px-4 py-2 rounded-md font-medium">
              Sign Up
            </button>
            <button className="md:hidden text-black">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
      
  )
}
