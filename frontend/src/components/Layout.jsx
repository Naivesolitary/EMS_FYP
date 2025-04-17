import React from 'react'
import NavMenu from './NavMenu'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

export default function Layout({children}) {
  return (
    
     <div className="min-h-screen flex flex-col">
      <NavMenu/>
      <main className="flex-grow pt-16">
      <Outlet/>
      </main>
      <Footer/>
    </div>
      
   
  )
}
