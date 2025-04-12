import React from 'react'
import NavMenu from './NavMenu'
import { Outlet } from 'react-router-dom'

export default function Layout({children}) {
  return (
    
     <div className="min-h-screen flex flex-col">
      <NavMenu/>
      <main className="flex-grow">
      <Outlet/>
      </main>
      {/* Footer can be added here if needed */}
    </div>
      
   
  )
}
