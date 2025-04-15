import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Payment from './pages/Payment.jsx'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Events from './pages/Events.jsx'
import CreateEvent from './pages/CreateEvent.jsx'
import Error from './components/Error.jsx'



const router = createBrowserRouter([
  {
    path:'/',
    element:<Layout/>,
    errorElement:<Error/>,
    children: [
      {
        index:true,
        element: <Home/>,
      },
      {
        path: '/login',
        element: <Login/>,
      },
      {
        path: 'signup',
        element: <Signup/>
      },

      {
        path: 'payment',
        element: <Payment/>
      },

      {
        path: 'events',
        element: <Events/>
      },
      {
        path: 'create-event',
        element: <CreateEvent/>
      },
      {
        path: '*',
        element: <Error />
      }
    
    ]
    
  }
])

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>

  
)
