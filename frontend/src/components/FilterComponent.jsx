import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

const FilterComponent = ({
  onSearch,
  onFilterChange,
  filters = [],
  placeholder = "Search...",
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    onSearch && onSearch(searchTerm);
  },[searchTerm,onSearch])

  // const handleSearchChange = (e) => {
  //   setSearchTerm(e.target.value);
  // };

  // const handleSearchSubmit = (e) => {
  //   e.preventDefault();
  //   onSearch && onSearch(searchTerm);
  // };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    onFilterChange && onFilterChange(name, value);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div>
      {/* <form onSubmit={handleSearchSubmit} className="relative"> */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            onSearch(e.target.value)
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        {/* <button
          type="submit"
          className="absolute inset-y-0 right-0 px-3 bg-blue-500 text-white rounded-r-md"
        >
          Search
        </button> */}
        </div>
      {/* </form> */}

      {/* Filters */}
      {filters.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {filters.map((filter) => (
            <div key={filter.name}>
              <label
                htmlFor={filter.name}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {filter.label}
              </label>

              {filter.type === "select" ? (
                <select
                  id={filter.name}
                  name={filter.name}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {filter.options.map((option, index) => (
                    <option key={index} value={option}>
                      {option || "All"}
                    </option>
                  ))}
                </select>
              ) : filter.type === "date" ? (
                <input
                  type="date"
                  id={filter.name}
                  name={filter.name}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <input
                  type="text"
                  id={filter.name}
                  name={filter.name}
                  onChange={handleFilterChange}
                  placeholder={`Filter by ${filter.label.toLowerCase()}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterComponent;
