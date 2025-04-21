"use client"

import { useState } from "react"
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock, FiPhone, FiUserCheck } from "react-icons/fi"
import { Link } from "react-router-dom"

const Signup = ({ onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "attendee",
  })

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!re.test(email)) {
      setEmailError("Please enter a valid email address")
      return false
    }
    setEmailError("")
    return true
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "email") {
      validateEmail(value)
    }
    setSignupForm({
      ...signupForm,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateEmail(signupForm.email)) {
      console.log("Signup form submitted:", signupForm)
      // Add your signup logic here
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">Fill in your details to get started</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700">
                <FiUser className="mr-2 h-4 w-4 text-purple-600" />
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={signupForm.name}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700">
                <FiMail className="mr-2 h-4 w-4 text-purple-600" />
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={signupForm.email}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  placeholder="Enter your email"
                />
                {emailError && <p className="mt-1 text-xs text-red-600">{emailError}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="flex items-center text-sm font-medium text-gray-700">
                <FiLock className="mr-2 h-4 w-4 text-purple-600" />
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={signupForm.password}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="flex items-center text-sm font-medium text-gray-700">
                <FiPhone className="mr-2 h-4 w-4 text-purple-600" />
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={signupForm.phone}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="flex items-center text-sm font-medium text-gray-700">
                <FiUserCheck className="mr-2 h-4 w-4 text-purple-600" />
                User Role
              </label>
              <div className="mt-1">
                <select
                  id="role"
                  name="role"
                  value={signupForm.role}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                >
                  <option value="attendee">Attendee</option>
                  <option value="event_organizer">Event Organizer</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-lg bg-purple-600 px-4 py-3 text-sm font-semibold text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 ease-in-out hover:-translate-y-0.5"
            >
              Create Account
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              type="button"
              to="/login"
              className="font-medium text-purple-600 hover:text-purple-500"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
