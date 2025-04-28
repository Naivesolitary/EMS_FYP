import { BASE_URL } from "../config"
import axios from "../services/axios"
import {useAuth}  from "../context/AuthContext"
import { useState } from "react"
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi"
import { Link,useNavigate } from "react-router-dom"
import Notification from "../components/Notification"

const Login = ({ onSwitchToSignup }) => {
  const {login} = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    success: false // or "error"
  });
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  })

  const showNotification  = (message, success = true) => {
    setNotification({
      show:true,
      message,
      success
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setLoginForm({
      ...loginForm,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Login form submitted:", loginForm)
    try{
       handleLogin()
    }catch(err){
       console.error('Error while Log in ', err)
    }

    // Add your login logic here
  }

  const handleLogin = async() => {
    const response =  await axios.post(`${BASE_URL}/api/auth/login`, loginForm, { withCredentials: true })
    console.log(response)
    const {payload,tokens} = response.data.data
    const {message,success} = response.data
    console.log("Message: ", message , "Success: ",success)
    
    login(payload,tokens.accessToken)
    showNotification(message,success)
    if (success) {
      setTimeout(() => {
        navigate("/");
      }, 2000); // 
    }
   

  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        {notification.show && (
        <Notification
          message={notification.message}
          success={notification.success}
          onClose={() => setNotification({...notification,show:false})}
        />
      )}
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to continue to your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
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
                  value={loginForm.email}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  placeholder="Enter your email"
                />
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
                  autoComplete="current-password"
                  required
                  value={loginForm.password}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  placeholder="Enter your password"
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
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-lg bg-purple-600 px-4 py-3 text-sm font-semibold text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 ease-in-out hover:-translate-y-0.5"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to={'/signup'}
              className="font-medium text-purple-600 hover:text-purple-500"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
