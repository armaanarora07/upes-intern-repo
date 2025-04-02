import React from 'react';
import { FaFileInvoice } from 'react-icons/fa';

const FloatingButton = ({ onClick }) => { // Accept the onClick prop
    return (
        <button
            onClick={onClick} // Call the function passed from the parent
            className="fixed top-16 right-6 bg-blue-500 text-white rounded-lg px-4 py-2 shadow-lg hover:bg-blue-600 transition duration-300 mt-5 flex items-center dark:bg-blue-800 dark:text-gray-200 dark:hover:bg-blue-700"
        >
            <FaFileInvoice className="mr-2" size={20} />
            Generate Bill {/* Button text */}
        </button>
    );
    
};

export default FloatingButton; 