import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {setQr,removeQr} from '../slices/qrSlice';
import { FaTrash} from 'react-icons/fa';

const PaymentQR = () => {
  const dispatch = useDispatch();
  const {qr} = useSelector((state)=> state.qr);
  const [imagePreview, setImagePreview] = useState(qr); // State to hold the image preview
  const fileInputRef = useRef(null); // Reference to the file input


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            setImagePreview(base64String); // Set the image preview state
            dispatch(setQr(base64String));
        };
        reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null); // Reset the image preview state
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // Clear the input value
    }
    dispatch(removeQr());
  };

  return (
    <div className='w-1/2'>
       <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Add Payment QR</h2>
       <div className="flex items-center p-2">
        <div className="w-1/3 border border-gray-300 rounded-lg p-4 h-32 flex items-center justify-center">
            {imagePreview ? (
            <img src={imagePreview} alt="Image Preview" className="rounded-lg w-full h-full object-contain" />
            ) : (
            <span className="text-gray-400 dark:text-gray-200">Upload QR</span>
            )}
        </div>
        <div className="ml-4 flex items-center">
            <button
            onClick={() => fileInputRef.current.click()} // Trigger file input click
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
            Upload
            </button>
            <input
            type="file"
            accept="image/*"
            className="hidden" // Hide the input
            onChange={handleImageUpload} // Function to handle image upload
            ref={fileInputRef} // Attach the ref to the input
            />
            {imagePreview && ( // Conditionally render the Remove button
            <button 
                onClick={handleRemoveImage} 
                className="ml-2 bg-white-500 text-black p-2 rounded-lg hover:bg-white-600 transition duration-200 dark:bg-blue-800 dark:text-gray-200 dark:hover:bg-blue-700 dark:border-blue-800"
            >
                <FaTrash/>
            </button>
            )}
        </div>
    </div>
    </div>
  );
};

export default PaymentQR;
