import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

/**
 * BackButton Component
 * A reusable back navigation button with modern styling and animations
 * 
 * @param {string} to - Optional: Specific route to navigate to (if not provided, uses browser history)
 * @param {string} label - Optional: Custom label text (default: "Back")
 * @param {string} destination - Optional: Destination name for tooltip (e.g., "My Business")
 * @param {string} variant - Optional: Style variant ("default" | "minimal" | "text")
 * @param {string} className - Optional: Additional CSS classes
 */
const BackButton = ({ 
  to, 
  label = "Back", 
  destination = "", 
  variant = "default",
  className = "" 
}) => {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  // Style variants
  const variants = {
    default: "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-50 dark:bg-gray-700/50 border border-blue-200 dark:border-gray-600 text-[#4154f1] dark:text-gray-300 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-600/50 hover:border-[#4154f1] dark:hover:border-gray-500 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4154f1] dark:focus:ring-gray-500 transition-all duration-200 font-medium shadow-sm hover:shadow group",
    minimal: "inline-flex items-center gap-1.5 px-2.5 py-1.5 text-sm bg-transparent text-gray-600 dark:text-gray-400 hover:text-[#4154f1] dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 font-medium group",
    text: "inline-flex items-center gap-1.5 text-sm text-[#4154f1] dark:text-gray-400 hover:text-blue-600 dark:hover:text-gray-300 font-medium transition-colors duration-200 group"
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleBack}
        onMouseEnter={() => destination && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`${variants[variant]} ${className}`}
        aria-label={destination ? `Go back to ${destination}` : "Go back"}
      >
        <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform duration-200" />
        <span className="text-sm">{label}</span>
      </button>
      
      {/* Tooltip - shows destination on hover */}
      {destination && showTooltip && (
        <div className="absolute left-0 top-full mt-2 px-2.5 py-1.5 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded-md shadow-lg whitespace-nowrap z-50 animate-fadeIn">
          {destination}
          <div className="absolute -top-1 left-3 w-2 h-2 bg-gray-800 dark:bg-gray-700 transform rotate-45"></div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BackButton;
