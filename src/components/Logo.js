import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {setLogo,removeLogo} from '../slices/logoSlice';
import { FaTrash} from 'react-icons/fa';

const Logo = () => {
  const dispatch = useDispatch();
  const {logo} = useSelector((state)=> state.logo);
  const [imagePreview, setImagePreview] = useState(logo); // State to hold the image preview
  const fileInputRef = useRef(null); // Reference to the file input


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            setImagePreview(base64String); // Set the image preview state
            dispatch(setLogo(base64String));
        };
        reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null); // Reset the image preview state
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // Clear the input value
    }
    dispatch(removeLogo());
  };

  return (
    <div className='w-1/2'>
       <h2 className="text-2xl font-bold text-gray-800">Add Logo</h2>
       <div className="flex items-center p-2">
        <div className="w-1/3 border border-gray-300 rounded-lg p-4 h-32 flex items-center justify-center">
            {imagePreview ? (
            <img src={imagePreview} alt="Image Preview" className="rounded-lg w-full h-full object-contain" />
            ) : (
            <span className="text-gray-400">Upload Logo</span>
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
                className="ml-2 bg-white-500 text-black p-2 rounded-lg hover:bg-white-600 transition duration-200"
            >
                <FaTrash/>
            </button>
            )}
        </div>
    </div>
    </div>
  );
};

export default Logo;
