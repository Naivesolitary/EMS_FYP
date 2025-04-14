import React, { useState } from 'react'

export default function CustomDropdown({title, children}) {
    const [isOpen, setIsOpen] = useState(false);
    
    


  return (
    <div className="p-4 border rounded-md w-full max-w mx-auto">
    <div onClick={() => setIsOpen(!isOpen)}className="cursor-pointer flex items-center justify-between">
        <h3 className="font-semibold text-lg">{title}</h3>
                <span>{isOpen ? "▲" : "▼"}</span>
    </div>

    {isOpen && (
    <div className="mt-4 space-y-4">
        {children}
</div>
)}
</div>
  )
}
