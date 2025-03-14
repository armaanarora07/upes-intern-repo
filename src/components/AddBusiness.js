import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useSelector, useDispatch } from "react-redux";
import { setTitle } from '../slices/navbarSlice';

const AddBusiness = () => {
  const [gstin, setGstin] = useState('');
  const [status, setStatus] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [businessDetails, setBusinessDetails] = useState(null);
  const authToken = useSelector((state) => state.auth.authToken);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTitle('Add Business'));
  }, [dispatch]);

  const handleGstinChange = async (e) => {
    const formattedGST = e.target.value.toUpperCase().trim();
    setGstin(formattedGST);
    if (formattedGST.length === 15) {
      handleVerify(formattedGST);
    }
  };

  const handleVerify = async (gstNumber) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/business?gstin=${gstNumber}`, {
        headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" },
      });
      
      if (response.status === 200) {
        console.log(response.data);
        setBusinessDetails(response.data.data);
        setIsVerified(true);
        setStatus(true);
      } else {
        setIsVerified(false);
        setStatus(true);
      }
    } catch (error) {
      console.log(error);
      setIsVerified(false);
      setStatus(true);
      setBusinessDetails('');
      setErrorMessage(error.response.data.message);
    }
  };

  const handleAddBusiness = async () => {
    if (!isVerified) {
      alert(errorMessage);
      return;
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/business`, { status: "yes" }, {
        headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        console.log('Business added successfully:', response.data);
        setSuccessMessage('Business added successfully');
      }
    } catch (error) {
      setErrorMessage('Error Adding Business');
    }
  };

  return (
    <div className='flex justify-center items-center p-8 mt-5'>
      <div className='w-96 p-6 bg-white border border-gray-200 rounded-lg shadow-xl w-full max-w-lg p-8'>
        <h2 className="text-2xl font-bold text-gray-800 text-center">Add Business</h2>

        <div className="relative mt-4">
          <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">GSTIN Number</span>
          <input
            type="text"
            className="w-full border border-blue-500 rounded-lg p-2"
            value={gstin}
            onChange={handleGstinChange}
            required
          />
          {status && (
            <span className={`absolute right-2 top-2 ${isVerified ? 'text-green-500' : 'text-red-500'}`}>
              {isVerified ? <FaCheckCircle /> : <FaTimesCircle />}
            </span>
          )}
        </div>

        {isVerified && businessDetails ? (
          <div className='mt-4 p-4 border rounded-lg bg-gray-50'>
            <p><strong>Trade Name:</strong> {businessDetails.trade_name}</p>
            <p><strong>Legal Name:</strong> {businessDetails.legal_name}</p>
            <p><strong>Legal Name:</strong> {businessDetails.gstin}</p>
          </div>
        ):(errorMessage && (
          <div className='mt-4 p-4 border rounded-lg bg-gray-50'>
            <p>{errorMessage}</p>
          </div>
        ))}

        {successMessage && (
          <div className='mt-4 p-4 border rounded-lg bg-gray-50'>
            <p>{successMessage}</p>
          </div>
        )}

        <div className='flex justify-center mt-4'>
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200" onClick={handleAddBusiness}>
            Add Business
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBusiness;
