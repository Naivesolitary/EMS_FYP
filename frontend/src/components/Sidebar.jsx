"use client"
import { FaHome, FaCalendarAlt, FaUserCheck, FaTicketAlt, FaUsers, FaMapMarkerAlt } from "react-icons/fa"

const Sidebar = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaHome /> },
    { id: "events", label: "Event Management", icon: <FaCalendarAlt /> },
    { id: "organizers", label: "Organizer Verification", icon: <FaUserCheck /> },
    { id: "bookings", label: "Booking Management", icon: <FaTicketAlt /> },
    { id: "attendees", label: "Attendee Management", icon: <FaUsers /> },
    { id: "venues", label: "Venue Management", icon: <FaMapMarkerAlt /> },
  ]

  return (
    <aside className="w-64 bg-white shadow-md z-10 hidden md:block">
      {/* <div className="h-16 flex items-center justify-center border-b">
        <h1 className="text-xl font-bold text-blue-600">Event Admin</h1>
      </div> */}
      <nav className="mt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className="mb-2">
              <button
                onClick={() => onSectionChange(item.id)}
                className={`flex items-center w-full px-6 py-3 text-left transition-colors ${
                  activeSection === item.id
                    ? "bg-blue-50 text-blue-600 border-r-4 border-blue-500"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
