import React, { useState,useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaBriefcase,FaCheckCircle, FaTimesCircle, FaTrashAlt, FaPlus, FaMapMarkerAlt } from 'react-icons/fa';
import { useSelector } from "react-redux";

const UpdateBusiness = () => {
  const [gstin, setGstin] = useState('');
  const [username,setUsername] = useState('');
  const [legalName, setLegalName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [shippingAddress1, setShippingAddress1] = useState('');
  const [shippingAddress2, setShippingAddress2] = useState('');
  const [legalAddress, setLegalAddress] = useState('');
  const [hsnCode, setHsnCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const authToken = useSelector((state) => state.auth.authToken); // access from global auth state 
  const location = useLocation();
  const [showHsnPopup, setShowHsnPopup] = useState(false);
  const [availableHsnCodes, setAvailableHsnCodes] = useState(['1234', '5678', '91011']); // Dummy HSN codes
  const [showAddressPopup, setShowAddressPopup] = useState(false); // State to control address popup visibility
  const [showAddSkippedBillPopup, setShowAddSkippedBillPopup] = useState(false); // State to control Add Skipped Bill popup visibility
  const [serialNo, setSerialNo] = useState('');
  const [date, setDate] = useState('');

  useEffect(()=>{

   const getQueryParams = () => {
    return new URLSearchParams(location.search);
  };
   
   const fetchdata = () =>{
    const queryParams = getQueryParams();
    const id = queryParams.get('id'); // Access the 'id' query parameter
    setGstin(queryParams.get('gstin'));
    setUsername(queryParams.get('user'));
    setLegalName(queryParams.get('legalname'));
    setTradeName(queryParams.get('tradename'));
    setShippingAddress1(queryParams.get('shippingAddress1'));
    setShippingAddress2(queryParams.get('shippingAddress2'));
   }

   fetchdata();
  },[]);

  const handleShowHsnPopup = () => {
    setShowHsnPopup(true); // Show the popup
  };

  const handleDeleteHsnCode = (code) => {
    setAvailableHsnCodes(availableHsnCodes.filter(hsn => hsn !== code)); // Remove the selected HSN code
  };

  const handleShowAddressPopup = () => {
    setShowAddressPopup(true); // Show the address popup
  };

  const handleShowAddSkippedBillPopup = () => {
    setShowAddSkippedBillPopup(true); // Show the Add Skipped Bill popup
  };

  return (
    <div className='p-6'>

      <div className="flex items-center space-x-3 text-[#4154f1] font-bold text-3xl mb-6">
        <FaBriefcase className="text-4xl" />
        <span>My Business</span>
      </div>

      <div className="text-xl sm:pl-4 sm:text-2xl space-x-3 mt-2 font-medium">
        My Business Details 
      </div>
  
      <div className="flex space-x-3">
        <div className="w-2/5 p-2 relative">
          <div className="space-y-4 relative mt-4">

            <div className="flex justify-between items-center">
              <span className="font-semibold">UserName</span>
              <span className="text-gray-700">{username}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">GSTIN</span>
              <span className="text-gray-700">{gstin}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Legal Name</span>
              <span className="text-gray-700">{legalName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Trade Name</span>
              <span className="text-gray-700">{tradeName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Serial Number</span>
              <input
                type="text"
                className="border border-[#4154f1] rounded-lg p-2 w-1/2 text-gray-700"
                value={serialNo}
                onChange={(e) => setSerialNo(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="w-2/5 p-2 relative">
          <div className="space-y-4 relative mt-4">
            {/* Buttons */}
            <div className="flex flex-col space-y-4 mt-4">

              <button 
                className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center justify-center shadow-md transform hover:scale-105 w-3/4 mx-auto" // Reduced width
                onClick={handleShowAddressPopup} // Show address popup on click
              >
                <FaMapMarkerAlt className="mr-2" /> 
                Shipping Address
              </button>
              <button 
                className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center justify-center shadow-md transform hover:scale-105 w-3/4 mx-auto" // Reduced width
                onClick={handleShowHsnPopup} // Show popup on click
              >
                <FaBriefcase className="mr-2" />
                View HSN Codes
              </button>

              <button 
                className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center justify-center shadow-md transform hover:scale-105 w-3/4 mx-auto" // Reduced width
                onClick={handleShowAddSkippedBillPopup} // Show Add Skipped Bill popup on click
              >
                <FaPlus className="mr-2" /> {/* Icon for visual appeal */}
                Add Skipped Bill
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* HSN Code Popup */}
      {showHsnPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3"> {/* Increased width of the popup */}
            <h2 className="font-semibold text-lg mb-4 text-center">Available HSN Codes</h2>
            <div className="mb-4 border-b pb-4"> {/* Added bottom border and padding */}
              {availableHsnCodes.map((code, index) => (
                <div key={index} className="flex justify-between items-center mb-2 p-2 hover:bg-gray-100 rounded"> {/* Added hover effect and padding */}
                  <span>{code}</span>
                  <FaTrashAlt 
                    className="text-red-500 cursor-pointer" 
                    onClick={() => handleDeleteHsnCode(code)} 
                  />
                </div>
              ))}
            </div>
            <div className="relative mb-4">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                HSN Code
              </span>
              <input
                type="text"
                className="w-full border border-[#4154f1] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" // Added focus styles
                value={hsnCode}
                onChange={(e) => setHsnCode(e.target.value)} 
              />
            </div>
            <div className="flex space-x-4 mt-4">
              <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200 w-full">
                Add HSN
              </button>
              <button 
                className="bg-gray-300 text-black p-2 rounded-lg hover:bg-gray-400 transition duration-200 w-full"
                onClick={() => setShowHsnPopup(false)} // Close popup
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address Popup */}
      {showAddressPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="font-semibold text-lg mb-4 text-center">Update Shipping Address</h2>
            <div className="relative mb-4">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">Flat, House no, Building, Company, Apartment</span>
              <input
                type="text"
                className="w-full border border-[#4154f1] rounded-lg p-2"
                value={shippingAddress1}
                onChange={(e) => setShippingAddress1(e.target.value)} 
              />
            </div>

            <div className="relative mb-4">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">Area, Street, Sector, Village, Landmarks</span>
              <input
                type="text"
                className="w-full border border-[#4154f1] rounded-lg p-2"
                value={shippingAddress2}
                onChange={(e) => setShippingAddress2(e.target.value)} 
              />
            </div>

            <div className="relative mb-4">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">City</span>
              <input
                type="text"
                className="w-full border border-[#4154f1] rounded-lg p-2"
                value={shippingAddress1} // Update to the correct state variable
                onChange={(e) => setShippingAddress1(e.target.value)} 
              />
            </div>

            <div className="relative mb-4">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">State</span>
              <input
                type="text"
                className="w-full border border-[#4154f1] rounded-lg p-2"
                value={shippingAddress1} // Update to the correct state variable
                onChange={(e) => setShippingAddress1(e.target.value)} 
              />
            </div>

            <div className="relative mb-4">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">PinCode</span>
              <input
                type="text"
                className="w-full border border-[#4154f1] rounded-lg p-2"
                value={shippingAddress1} // Update to the correct state variable
                onChange={(e) => setShippingAddress1(e.target.value)} 
              />
            </div>

            <div className="flex space-x-4 mt-4">
              <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200 w-full" onClick={() => setShowAddressPopup(false)}>
                Save Address
              </button>
              <button className="bg-gray-300 text-black p-2 rounded-lg hover:bg-gray-400 transition duration-200 w-full" onClick={() => setShowAddressPopup(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Skipped Bill Popup */}
      {showAddSkippedBillPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="font-semibold text-lg mb-4 text-center">Add Skipped Bill</h2>
            <div className="relative mb-4">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">GST</span>
              <input
                type="text"
                className="w-full border border-[#4154f1] rounded-lg p-2"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)} 
              />
            </div>

            <div className="relative mb-4">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">Serial Number</span>
              <input
                type="text"
                className="w-full border border-[#4154f1] rounded-lg p-2"
                value={serialNo}
                onChange={(e) => setSerialNo(e.target.value)} 
              />
            </div>

            <div className="relative mb-4">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">Date</span>
              <input
                type="date"
                className="w-full border border-[#4154f1] rounded-lg p-2"
                value={date}
                onChange={(e) => setDate(e.target.value)} 
              />
            </div>

            <div className="flex space-x-4 mt-4">
              <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200 w-full">
                Confirm
              </button>
              <button 
                className="bg-gray-300 text-black p-2 rounded-lg hover:bg-gray-400 transition duration-200 w-full"
                onClick={() => setShowAddSkippedBillPopup(false)} // Close popup
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateBusiness;
