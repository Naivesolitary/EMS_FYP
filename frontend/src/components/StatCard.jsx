const StatCard = ({ title, value, icon, color }) => {
    return (
      <div className="bg-white rounded-lg shadow p-6 flex items-center">
        <div className={`${color} p-3 rounded-full mr-4`}>{icon}</div>
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-semibold text-gray-800">{value !== undefined ? value.toLocaleString() : "0"}</p>
        </div>
      </div>
    )
  }
  
  export default StatCard
  