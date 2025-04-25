import React from 'react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Moon from '../images/Moon.png';
import Dragon from '../images/Dragon Sky.jpg';
import Twilight from '../images/Twilight.png';
import Cloud from '../images/Cloud.png'
import { useAuth } from '../context/AuthContext';

export default function NavMenu() {
    const {auth} = useAuth()
    const navState = ( {isActive} ) => `font-medium border-b-2 transition duration-300 ${
    isActive ? 'border-red-600' : 'border-transparent hover:border-green-400'
  }`

  //  const profilePicUrl = "https://i.pravatar.cc/40"
  

    return (
        <nav className="bg-white py-4 px-6 border-b border-gray-200 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className='text-2xl font-bold text-black'>Evenera</Link>
           
          </div>
          <div className="hidden md:flex space-x-6">
            <NavLink to="/"  className={navState}   ><span>Home</span></NavLink>
            <NavLink to="/events" className={navState}>Events</NavLink>
            <NavLink to="/about" className={navState}>About</NavLink>
            <NavLink to="/contact" className={navState}>Contact</NavLink>
          </div>
          <div className="flex items-center space-x-4">
             {auth.accessToken ? (
              <Link to="/profile">
              <img
                src={Cloud}
                alt="Profile"
                className="w-15 h-15 rounded-full object-cover border-2 border-gray-300 hover:border-emerald-400 transition duration-300"
              />
            </Link>) : (
            <div>
            <Link to= '/login' className="text-black font-medium cursor-pointer  mr-4">Login</Link>
            <Link to="/signup" className="bg-black text-white px-4 py-2 rounded-md font-medium cursor-pointer">
              Sign Up
            </Link>

            </div>)}

            
            
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
