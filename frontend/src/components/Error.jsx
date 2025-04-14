import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Error() {
  const navigate = useNavigate()
  useEffect(() => {
    const timer = setTimeout(() => {
        navigate('/')

    },3000)
    
    return () => clearTimeout(timer); //cleanup

  },[navigate])
  return (
    <div>
    <h1>404 -  Page not Found ❌</h1>
    <p>Redirecting you to the home page...</p>
     
    </div>
  )
}
