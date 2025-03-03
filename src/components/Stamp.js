import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {setStamp, removeStamp, toggle} from '../slices/stampSlice';
import { FaTrash} from 'react-icons/fa';

const Stamp = () => {
  const dispatch = useDispatch();
  const {stamp,enabled} = useSelector((state)=> state.stamp);
  const [imagePreview, setImagePreview] = useState(stamp); // State to hold the image preview
  const fileInputRef = useRef(null); // Reference to the file input


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            setImagePreview(base64String); // Set the image preview state
            dispatch(setStamp(base64String));
        };
        reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null); // Reset the image preview state
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // Clear the input value
    }
    dispatch(removeStamp());
  };

  const handleToggle = () =>{
    dispatch(toggle());
  }

  return (
    <div className='w-1/2'>

       <div className='flex space-x-3'>
        <h2 className="text-2xl font-bold text-gray-800">Stamp</h2>
        <label className="flex items-center cursor-pointer">
          <input type="checkbox" className="hidden" checked={enabled} onChange={handleToggle} />
          <div 
            className="w-12 h-6 flex items-center rounded-full p-1 transition" 
            style={{ backgroundColor: enabled ? '#3B82F6' : '#6B7280' }} // Blue when enabled, Gray when disabled
          >
            <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition ${enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </div>
        </label>
        </div>

       <div className="flex items-center p-2">
        <div className="w-1/3 border border-gray-300 rounded-lg p-4 h-32 flex items-center justify-center">
            {imagePreview ? (
            <img src={imagePreview} alt="Image Preview" className="rounded-lg w-full h-full object-contain" />
            ) : (
            <span className="text-gray-400">Upload Stamp</span>
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

export default Stamp;
