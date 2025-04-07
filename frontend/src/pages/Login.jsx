import React from 'react'
import '../assets/app.css'
import { Link, Links } from 'react-router-dom'

export default function Login() {
  return (
    <>
    <div className='login-form'>
    <h2>Login</h2>
    <form action="/login" method="POST">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" placeholder="Enter your email" required/>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" placeholder="Enter your password" required/>
      </div>
      <button type="submit">Login</button>
    </form>
    <p>
      Don't have an account? <Link to={'/signup'}>Sign Up</Link>
    </p>
      
    </div>

    </>
    
  )
}
