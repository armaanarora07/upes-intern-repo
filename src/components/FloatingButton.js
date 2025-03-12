import React from 'react';
import { FaFileInvoice } from 'react-icons/fa';

const FloatingButton = ({ onClick }) => { // Accept the onClick prop
    return (
        <button
            onClick={onClick} // Call the function passed from the parent
            className="fixed top-16 right-6 bg-blue-500 text-white dark:bg-gray-900 dark:text-gray-200 rounded-md px-4 py-2 shadow-lg hover:bg-blue-600 dark:hover:bg-gray-700 transition duration-300 mt-5 flex items-center"
        >
            <FaFileInvoice className="mr-2" size={20} />
            Generate Bill {/* Button text */}
        </button>
    );
    
};

export default FloatingButton; 