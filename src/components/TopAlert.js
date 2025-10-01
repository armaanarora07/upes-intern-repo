import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const TopAlert = ({ type = 'warning', message, onClose, position = 'top-center', duration = 4000 }) => {
  const [visible, setVisible] = useState(true);

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

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(t);
  }, [visible, duration]);

  useEffect(() => {
    if (!visible && onClose) {
      const t = setTimeout(() => onClose(), 220); // let fade-out animation run
      return () => clearTimeout(t);
    }
  }, [visible, onClose]);

  return (
    <div
      className={`${positionClass} p-4 border-l-4 rounded shadow-lg ${alertStyles[type]} z-50 transition-all duration-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
      role="alert"
    >
      <div className="flex justify-between items-center">
        <span className="text-sm">{message}</span>
        <button
          onClick={() => setVisible(false)}
          className="ml-4 text-lg font-bold text-gray-500 hover:text-gray-700"
          aria-label="close-alert"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default TopAlert;