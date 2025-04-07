import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'


const router = createBrowserRouter([
  {
    path:'/',
    element:<App/>,
    children: [
      {
        path: '/login',
        index:true,
        element: <Login/>,
      },
      {
        path: 'signup',
        element: <Signup/>
      }
    ]
    
  }
])

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>

  
)
