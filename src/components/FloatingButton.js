import React from 'react';
import ReactDOM from 'react-dom';
import { FaFileInvoice } from 'react-icons/fa';
import { motion } from 'framer-motion';

const FloatingButton = ({ onClick }) => { // Accept the onClick prop
    // Render button using Portal - places it at document body level, outside all animations
    return ReactDOM.createPortal(
        <motion.button
            onClick={onClick} // Call the function passed from the parent
            className="fixed top-16 right-6 bg-blue-500 text-white rounded-lg px-4 py-2 shadow-lg hover:bg-blue-600 mt-5 flex items-center dark:bg-blue-800 dark:text-gray-200 dark:hover:bg-blue-700 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ transition: 'background-color 0.3s ease' }}
        >
            <FaFileInvoice className="mr-2" size={20} />
            Generate Bill {/* Button text */}
        </motion.button>,
        document.body // Render directly to body, outside React component tree
    );
    
};

export default FloatingButton; 