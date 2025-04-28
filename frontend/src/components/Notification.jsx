import { useEffect } from "react";
import { FiCheck, FiX } from "react-icons/fi";

const Notification = ({ message, success, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = (success) ? "bg-green-100" : "bg-red-100";
  const textColor = (success) ? "text-green-800" : "text-red-800";
  const borderColor = (success) ? "border-green-300" : "border-red-300";
  const icon = (success) ? <FiCheck className="w-5 h-5" /> : <FiX className="w-5 h-5" />;

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg border ${bgColor} ${textColor} ${borderColor} shadow-lg transition-all animate-fade-in`}
    >
      <div className="mr-3">{icon}</div>
      <div className="text-sm font-medium">{message}</div>
      <button
        onClick={onClose}
        className="ml-4 text-gray-500 hover:text-gray-700"
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Notification;