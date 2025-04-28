import { FaBell, FaSignOutAlt, FaBars } from "react-icons/fa"

const Topbar = () => {
  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10">
      <button className="md:hidden text-gray-600">
        <FaBars size={20} />
      </button>

      <div className="flex-1 md:ml-4 md:flex-none"></div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-600 hover:text-blue-500 transition-colors">
          <FaBell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center">
          <div className="mr-3 text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-800">Admin User</p>
            <p className="text-xs text-gray-500">admin@example.com</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
            AU
          </div>
        </div>

        <button className="p-2 text-gray-600 hover:text-red-500 transition-colors">
          <FaSignOutAlt size={18} />
        </button>
      </div>
    </header>
  )
}

export default Topbar
