const CustomSelectDropdown = ({
    label,
    options = [],
    style,
    value,
    onChange,
    required = false,
    name,
    placeholder = "Select a Category",
  }) => {
    return (
      <div className="mb-4">
        <label className="block font-medium mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 align-middle"
        >
        {console.log(value)}
          <option value="" hidden>{placeholder}</option>
          {options.map((option, idx) => (
            <option key={idx} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  };
  
  export default CustomSelectDropdown;
  