import React from 'react'
import '../assets/app.css'
import { Link } from 'react-router-dom'

export default function Signin() {
  return (
    <div class="signup-form">
    <h2>Sign Up</h2>
    <form action="/signup" method="POST">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" placeholder="Enter your email" required/>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" placeholder="Enter your password" required/>
      </div>
      <div>
        <label for="confirm-password">Confirm Password:</label>
        <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirm your password" required/>
      </div>
      <button type="submit">Sign Up</button>
    </form>
    <p>
      Already have an account? <Link to={'/login'}>Login</Link>
    </p>
  </div>
  )
}
