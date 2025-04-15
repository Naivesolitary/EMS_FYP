import React from 'react'
import { Link } from 'react-router-dom';

export default function Footer() {
    const currentYear = new Date().getFullYear();
  return (
       
       <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
       <div className="max-w-7xl mx-auto">
         <div className="flex flex-col md:flex-row justify-between items-center">
           <h2 className="text-2xl font-bold mb-4 md:mb-0">Evenera</h2>
           <div className="flex space-x-6">
             <Link to="/terms">Terms</Link>
             <Link to="/privacy">Privacy</Link>
             <Link to="/contact">Contact</Link>
           </div>
         </div>
         <p className="mt-8 text-center text-gray-400">&copy; {currentYear} Evenera. All rights reserved.</p>
       </div>
     </footer>
  )
}
