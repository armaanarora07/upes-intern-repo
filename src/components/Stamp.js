import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {setStamp, removeStamp, toggle} from '../slices/stampSlice';
import { Trash2 } from 'lucide-react';


//
// same changes to the Stamp component as done in Signature component - by sagar
//

const Stamp = () => {
  const dispatch = useDispatch();
  const {stamp,enabled} = useSelector((state)=> state.stamp);
  const [imagePreview, setImagePreview] = useState(stamp);
  const [error, setError] = useState(''); // State for handling errors
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File Type Check
    if (!file.type.startsWith('image/')) {
      setError('File type not supported. Please upload an image.');
      return;
    }

    // File Size Check (e.g., 2MB limit)
    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSizeInBytes) {
      setError('File is too large. Please upload an image under 2MB.');
      return;
    }

    setError(''); // Clear any previous errors
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64String = reader.result;
        try {
          setImagePreview(base64String);
          dispatch(setStamp(base64String));
        } catch (storageError) {
          setError('Could not save the image. Storage might be full.');
          setImagePreview(null);
        }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    dispatch(removeStamp());
  };

  const handleToggle = () =>{
    dispatch(toggle());
  }

  return (
    <div className='w-full'>
       <div className='flex space-x-3 items-center dark:bg-gray-800 dark:border-gray-700'>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Stamp</h2>
        <label className="flex items-center cursor-pointer">
          <input type="checkbox" className="hidden" checked={enabled} onChange={handleToggle} />
          <div
            className="w-12 h-6 flex items-center rounded-full p-1 transition dark:bg-gray-800 dark:border-gray-700"
            style={{ backgroundColor: enabled ? '#3B82F6' : '#6B7280' }}
          >
            <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition dark:bg-gray-800 dark:border-gray-700 ${enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </div>
        </label>
        </div>

       <div className="flex items-center p-2">
        <div className="w-1/3 border border-gray-300 rounded-lg p-4 h-32 flex items-center justify-center">
            {imagePreview ? (
            <img src={imagePreview} alt="Stamp Preview" className="rounded-lg w-full h-full object-contain" />
            ) : (
            <span className="text-gray-400">Upload Stamp</span>
            )}
        </div>
        <div className="ml-4 flex flex-col items-start">
            <div className="flex items-center">
                <button
                onClick={() => fileInputRef.current.click()}
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200 dark:bg-blue-800 dark:text-blue-200 dark:hover:bg-blue-700"
                >
                Upload
                </button>
                <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                ref={fileInputRef}
                />
                {imagePreview && (
                <button
                    onClick={handleRemoveImage}
                    className="ml-2 bg-white-500 text-black p-2 rounded-lg hover:bg-white-600 transition duration-200  dark:text-gray-200"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
                )}
            </div>
            <p className="text-xs text-gray-500 mt-2 dark:text-gray-400">(only image files allowed, max 2MB)</p>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    </div>
    </div>
  );
};

export default Stamp;