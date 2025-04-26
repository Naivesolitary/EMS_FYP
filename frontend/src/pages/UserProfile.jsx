import { useEffect, useState } from "react"
import {FiUser,FiMail, FiPhone, FiLock, FiUpload, FiSave,
  FiHeart,FiCalendar,FiEdit,FiEye,FiEyeOff,FiCheck,FiX,
} from "react-icons/fi"
import { checkRole } from "../services/checkRole"
import { useAuth } from "../context/AuthContext"
import { BASE_URL } from "../config"
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useNavigate } from "react-router-dom";
import Notification from "../components/Notification"

const UserProfile = () => {
  // Sample user data - would come from props or context in a real app
  const navigate = useNavigate()
  const {auth} = useAuth()
  if(!auth || !auth.accessToken){
    return navigate('/')
  }
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success" // or "error"
  });
  const axiosPrivate = useAxiosPrivate()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "••••••••",
    profileImage: "/placeholder.svg?height=200&width=200"
  })


  const showNotification  = (message, type = "success") => {
    setNotification({
      show:true,
      message,
      type
    })
  }
  // const [user, setUser] = useState({
  //   username: "johndoe",
  //   email: "john.doe@example.com",
  //   phone: "+1 (555) 123-4567",
  //   password: "••••••••",
  //   profileImage: "/placeholder.svg?height=200&width=200",
  // })  
  
  const [user, setUser] = useState({})



  useEffect(() => {
    const getUserInfo = async() => {
      const response = await axiosPrivate.get(`/api/users/profile`);
      console.log("user-info: ", response.data.data)
      const {name,email,phone,image_url} = response.data.data
      // console.log("name: ",name, "email: ",email, "phone: ",phone, "password: ",password)
      setFormData(prev => ({
        ...prev, // Keep existing defaults
        username: name || "",
        email: email || "",
        phone: phone || "",
        profileImage: image_url || "/placeholder.svg?height=200&width=200"
      }));
      
    }
    getUserInfo()
  },[])

  // Add this new useEffect to sync formData with user
useEffect(() => {
  setFormData({ ...user });
}, [user]);

  console.log("USER: ",user)

  // Sample events data
  const [favouriteEvents, setFavouriteEvents] = useState([
    { id: 1, name: "Summer Music Festival", date: "2023-07-15", location: "Central Park" },
    { id: 2, name: "Tech Conference 2023", date: "2023-08-22", location: "Convention Center" },
    { id: 3, name: "Food & Wine Expo", date: "2023-09-10", location: "Downtown Pavilion" },
  ])

  const [bookedEvents, setBookedEvents] = useState([
    { id: 101, name: "Jazz Night", date: "2023-06-30", amount: "$45.00", ticketType: "VIP" },
    { id: 102, name: "Art Exhibition", date: "2023-07-05", amount: "$25.00", ticketType: "General" },
    { id: 103, name: "Theater Show", date: "2023-08-12", amount: "$60.00", ticketType: "Premium" },
  ])

  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)

  const [imageFile, setImageFile] = useState(null)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordMatch, setPasswordMatch] = useState(true)


  console.log("Form Data: ", formData)
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData({
      ...passwordData,
      [name]: value,
    })

    // Check if passwords match when either new or confirm password changes
    if (name === "newPassword" || name === "confirmPassword") {
      if (name === "newPassword") {
        setPasswordMatch(value === passwordData.confirmPassword || passwordData.confirmPassword === "")
      } else {
        setPasswordMatch(value === passwordData.newPassword || value === "")
      }
    }
  }

  // Handle form submission
  const handleSubmit = async(e) => {
    e.preventDefault()

  

    // Check if passwords match before submitting
    if (passwordData.newPassword && passwordData.newPassword !== passwordData.confirmPassword) {
      console.log("Passwords do not match")
      return // Don't submit if passwords don't match
    }

     try{
       let uploadedImagePath = formData.profileImage
       if(imageFile){
        const uploadedPath = await uploadImage()
        if(uploadedPath){
          uploadedImagePath = uploadedPath
        }
       }

       const updateData = {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        profileImage: uploadedImagePath,
        ...(passwordData.newPassword && {password: passwordData.newPassword}),
       }

       const response = await axiosPrivate.put('/api/users/profile',updateData)
       showNotification("Profile updated successfully")
      //  console.log("Profile updated successfully: ", response.data)

       setUser(updateData)
       setIsEditing(false)
       setPasswordData({
        currentPassword:"",
        newPassword:"",
        confirmPassword: "",
       })
       console.log("Profile updated:", formData)
       console.log("Password updated:", passwordData)
     }catch(error){
      console.error("Error updating profile: ",error)     }

 

    // Here you would typically send the updated data to your backend
  }

  // Handle image upload
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)

      // Create a preview URL for the selected image
      const reader = new FileReader()
      reader.onload = (event) => {
        setFormData({
          ...formData,
          profileImage: event.target.result,
        })
      }
      reader.readAsDataURL(file)
    }
  }


  // JUST WORKING FINE :)
  const uploadImage = async () => {
    if(!imageFile) return null
    const formData = new FormData()
    formData.append('image',imageFile)

    try{
      const response = await axiosPrivate.post('/api/upload/profile',formData,{
        headers:{
          'Content-Type':'multipart/form-data'
        }
      })
      console.log(response.data.filePath)
      return response.data.filePath
    }catch(err){console.error("Image upload failed: ", err)}


  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({...notification,show:false})}
        />
      )}
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg border-2 border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">User Profile</h1>
        </div>

        <div className="flex border-b border-gray-200 overflow-x-auto">
          <button
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors ${
              activeTab === "profile" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <FiUser /> Profile
          </button>
          <button
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors ${
              activeTab === "favourites"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("favourites")}
          >
            <FiHeart /> Favourites
          </button>
          <button
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors ${
              activeTab === "bookings"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("bookings")}
          >
            <FiCalendar /> Bookings
          </button>
        </div>

        <div className="p-6">
          {activeTab === "profile" && (
            <div>
              <div className="flex justify-center mb-8">
                <div className="relative w-28 h-28 md:w-32 md:h-32 ring-4 ring-gray-50 rounded-full shadow-md">
                  <img
                    src={`${BASE_URL}${formData.profileImage}` || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                  <label
                    className="absolute bottom-0 right-0 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-blue-700 transition-colors"
                    htmlFor="profile-upload"
                  >
                    <FiUpload className="w-4 h-4" />
                  </label>
                  <input
                    type="file"
                    id="profile-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 transition-colors"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? (
                      <FiSave className="text-blue-600 w-4 h-4" />
                    ) : (
                      <FiEdit className="text-blue-600 w-4 h-4" />
                    )}
                    {isEditing ? " Save" : " Edit"}
                  </button>
                </div>

                <div className="mb-4">
                  <label className="flex items-center gap-2 mb-1.5 text-sm text-gray-600">
                    <FiUser className="text-blue-600 w-4 h-4" />
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full p-2.5 border ${
                      isEditing ? "border-gray-300" : "border-gray-200 bg-gray-50"
                    } rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  />
                </div>

                <div className="mb-4">
                  <label className="flex items-center gap-2 mb-1.5 text-sm text-gray-600">
                    <FiMail className="text-blue-600 w-4 h-4" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full p-2.5 border ${
                      isEditing ? "border-gray-300" : "border-gray-200 bg-gray-50"
                    } rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  />
                </div>

                <div className="mb-4">
                  <label className="flex items-center gap-2 mb-1.5 text-sm text-gray-600">
                    <FiPhone className="text-blue-600 w-4 h-4" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full p-2.5 border ${
                      isEditing ? "border-gray-300" : "border-gray-200 bg-gray-50"
                    } rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  />
                </div>

                {!isEditing ? (
                  <div className="mb-4">
                    <label className="flex items-center gap-2 mb-1.5 text-sm text-gray-600">
                      <FiLock className="text-blue-600 w-4 h-4" />
                      Password
                    </label>
                    <input
                      type="password"
                      value="••••••••"
                      disabled
                      className="w-full p-2.5 border border-gray-200 bg-gray-50 rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="mt-6 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-md font-medium text-gray-700 mb-3">Change Password</h3>

                    <div className="mb-3">
                      <label className="flex items-center gap-2 mb-1.5 text-sm text-gray-600">
                        <FiLock className="text-blue-600 w-4 h-4" />
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors pr-10"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="flex items-center gap-2 mb-1.5 text-sm text-gray-600">
                        <FiLock className="text-blue-600 w-4 h-4" />
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors pr-10"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="mb-1">
                      <label className="flex items-center gap-2 mb-1.5 text-sm text-gray-600">
                        <FiLock className="text-blue-600 w-4 h-4" />
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors pr-10 ${
                            !passwordMatch && passwordData.confirmPassword
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          }`}
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                        </button>
                      </div>
                      {!passwordMatch && passwordData.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <FiX className="w-3 h-3" /> Passwords do not match
                        </p>
                      )}
                      {passwordMatch && passwordData.confirmPassword && passwordData.newPassword && (
                        <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
                          <FiCheck className="w-3 h-3" /> Passwords match
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {isEditing && (
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-6 shadow-md"
                  >
                    <FiSave className="w-4 h-4" /> Save Changes
                  </button>
                )}
              </form>
            </div>
          )}

          {activeTab === "favourites" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Favourite Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favouriteEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white border-2 border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px] duration-300"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-md font-medium text-gray-800">{event.name}</h3>
                      <FiHeart className="text-red-500 text-lg" />
                    </div>
                    <div className="space-y-1.5 text-gray-600">
                      <p className="text-sm">
                        <span className="font-medium">Date:</span> {event.date}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Location:</span> {event.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Booked Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white border-2 border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px] duration-300"
                  >
                    <div className="mb-3">
                      <h3 className="text-md font-medium text-gray-800">{event.name}</h3>
                    </div>
                    <div className="space-y-1.5 text-gray-600">
                      <p className="text-sm">
                        <span className="font-medium">Date:</span> {event.date}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Amount:</span> {event.amount}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Ticket Type:</span>{" "}
                        <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {event.ticketType}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile
