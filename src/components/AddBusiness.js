import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { FaBriefcase,FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useSelector,useDispatch } from "react-redux";
import { setTitle } from '../slices/navbarSlice';

const AddBusiness = () => {
  const [gstin, setGstin] = useState('');
  const [status, setStatus] = useState(false);
  const [legalName, setLegalName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [legalAddress, setLegalAddress] = useState('');
  const [hsnCode, setHsnCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const authToken = useSelector((state) => state.auth.authToken); // access from global auth state 
  const dispatch = useDispatch();

  const handleGstinChange = async (e) => {
    const formattedGST = formatGSTNumber(e.target.value);
    setGstin(formattedGST);
  
    if (formattedGST.length === 15) {
      handleVerify(formattedGST);
    }

  };

  useEffect(()=>{
    
    const setNavTitle = () =>{
      dispatch(setTitle('Add Business'));
    }

    setNavTitle();
  },[setTitle,dispatch])

  const handleAddBusiness = async () => {

    if(!isVerified){
      alert('GST Not Verified');
    }

    const requestBody = {
      status: "yes",
      // Include other necessary fields here, e.g., gstin, legalName, etc.
    };
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/business`, requestBody, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Include the auth token if required
          "Content-Type": "application/json",
        },
      });
  
      if (response.status === 200) {
        // Handle successful response
        console.log('Business added successfully:', response.data);
      } else {
        console.error('Failed to add business:', response.data);
      }
    } catch (error) {
      console.error('Error adding business:', error);
      alert('Failed to Add Business');
    }
  };
  

  const formatGSTNumber = (gst) => {
    return gst.toUpperCase().trim(); // Convert to uppercase and trim whitespace
  };

  const handleVerify = async (gstNumber) => {
    if (!gstNumber) {
      alert('Enter a Valid GST Number');
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/validategst?gst=${gstNumber}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = response.data;

      if (response.statusText === 'OK') {
        setLegalName(data.data?.legal_name || '');
        setTradeName(data.data?.trade_name || '');
        setShippingAddress(data.data?.shipping_address.address1 || '');
        setLegalAddress(data.data?.principal_address.address1 || '');
        setHsnCode(data.data?.hsn_code || '');
        setIsVerified(true);
        setStatus(true);
      } else {
        console.error('Verification failed:', data);
        setIsVerified(false);
        setStatus(true);
      }
    } catch (error) {
      console.error('Error during verification:', error);
      setIsVerified(false);
      setStatus(true);
    }
  };

  return (
    <div className='p-8'>
       
      <div className='p-6 mt-5 mb-6 bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden h-auto'>

      <div className="text-2xl font-bold text-gray-800 mt-3">
        Enter your Business Details 
      </div>
  
      <div className="flex space-x-12">
        
        <div className="w-2/5 p-2 relative">
          <div className="space-y-4 relative mt-4">
            {/* GSTIN Input */}
            <div className="relative mb-4">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                GSTIN Number
              </span>
              <input
                type="text"
                className="w-full border border-[#4154f1] rounded-lg p-2"
                value={gstin}
                onChange={handleGstinChange}
                required
                
              />
              {/* Verification Status Indicator */}
              {status && (isVerified ? (
                <span className="absolute right-2 top-2 text-green-500">
                  <FaCheckCircle /> {/* Green tick icon */}
                </span>
              ) : (
                <span className="absolute right-2 top-2 text-red-500">
                  <FaTimesCircle /> {/* Red error icon */}
                </span>
              ))}
            </div>

            {/* Trade Name Input */}
            <div className="relative mb-4">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                Trade Name
              </span>
              <input
                type="text"
                className="w-full border border-[#4154f1] rounded-lg p-2"
                value={tradeName}
                onChange={(e) => setTradeName(e.target.value)} 
              />
            </div>

            {/* Legal Name Input */}
            <div className="relative mb-4">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                Legal Name
              </span>
              <input
                type="text"
                className="w-full border border-[#4154f1] rounded-lg p-2"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)} 
              />
            </div>

             {/* Legal Address Input */}
             <div className="relative mb-4">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                Legal Address
              </span>
              <input
                type="text"
                className="w-full border border-[#4154f1] rounded-lg p-2"
                value={legalAddress}
                onChange={(e) => setLegalAddress(e.target.value)} 
              />
            </div>

            {/* Shipping Address Input */}
            <div className="relative mb-4">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                Shipping Address
              </span>
              <input
                type="text"
                className="w-full border border-[#4154f1] rounded-lg p-2"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)} 
              />
            </div>

            {/* HSN Code Input */}
            <div className="relative mb-4">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                HSN Code
              </span>
              <input
                type="text"
                className="w-full border border-[#4154f1] rounded-lg p-2"
                value={hsnCode}
                onChange={(e) => setHsnCode(e.target.value)} 
              />
            </div>

            {/* Buttons */}
            <div className="flex space-x-4 mt-4">
              <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200 mr-1" onClick={handleAddBusiness}>
                Add Business
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default AddBusiness;
