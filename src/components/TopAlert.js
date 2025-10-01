import React from 'react';
import { FaTimes } from 'react-icons/fa';

const TopAlert = ({ type = 'warning', message, onClose, position = 'top-center' }) => {
  const alertStyles = {
    success: 'bg-green-100 border-green-400 text-green-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    error: 'bg-red-100 border-red-400 text-red-700',
  };

  const positionClass = (() => {
    switch (position) {
      case 'bottom-right':
        return 'fixed bottom-5 right-5 w-auto max-w-sm';
      case 'top-center':
      default:
        return 'fixed top-5 left-1/2 transform -translate-x-1/2 w-full max-w-md';
    }
  })();

  return (
    <div className={`${positionClass} p-4 border-l-4 rounded shadow-lg ${alertStyles[type]} z-50`} role="alert">
      <div className="flex justify-between items-center">
        <span className="text-sm">{message}</span>
        <button onClick={onClose} className="ml-4 text-lg font-bold text-gray-500 hover:text-gray-700">
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default TopAlert; 