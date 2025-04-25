import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Moon from '../images/Moon.png';
import Dragon from '../images/Dragon Sky.jpg';
import Twilight from '../images/Twilight.png';
import Cloud from '../images/Cloud.png';
import { useAuth } from '../context/AuthContext';
import useLogout from '../hooks/useLogout';
import { IoIosNotificationsOutline as Notification } from "react-icons/io";

export default function NavMenu() {
    const { auth } = useAuth();
    const logout = useLogout();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const handleProfileClick = (e) => {
        e.preventDefault();
        setIsDropdownOpen(prev => !prev);
    };

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
    };

    const handleViewProfile = () => {
        setIsDropdownOpen(false);
        navigate('/profile');
    };

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navState = ({ isActive }) =>
        `font-medium border-b-2 transition duration-300 ${
            isActive ? 'border-red-600' : 'border-transparent hover:border-green-400'
        }`;

    return (
        <nav className="bg-white py-4 px-6 border-b border-gray-200 fixed w-full top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className='text-2xl font-bold text-black'>Evenera</Link>
                
                <div className="hidden md:flex space-x-6">
                    <NavLink to="/" className={navState}>Home</NavLink>
                    <NavLink to="/events" className={navState}>Events</NavLink>
                    <NavLink to="/about" className={navState}>About</NavLink>
                    <NavLink to="/contact" className={navState}>Contact</NavLink>
                </div>

                <div className="flex items-center space-x-4 cursor-pointer relative">
                    {auth.accessToken ? (
                        <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
                            <div className="relative">
                                <Notification className="text-rose-500 hover:text-emerald-600 transition duration-300" size={25} />
                                {/* Notification count badge */}
                                <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-1.5 py-0.5">
                                    3 {/* Replace with actual count */}
                                </span>
                            </div>

                            <button onClick={handleProfileClick}>
                                <img
                                    src={Cloud}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 hover:border-emerald-400 transition duration-300"
                                />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 top-14 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                    <button
                                        onClick={handleViewProfile}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    >
                                        View Profile
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    >
                                        Logout
                                    </button>
                                    <button
                                        onClick={() => setIsDropdownOpen(false)}
                                        className="block px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 w-full text-left"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <Link to='/login' className="text-black font-medium cursor-pointer mr-4">Login</Link>
                            <Link to="/signup" className="bg-black text-white px-4 py-2 rounded-md font-medium cursor-pointer">
                                Sign Up
                            </Link>
                        </div>
                    )}

                    <button className="md:hidden text-black">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
}
