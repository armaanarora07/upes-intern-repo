import React, { useState,useEffect } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBriefcase,FaCheckCircle, FaTrashAlt, FaPlus, FaMapMarkerAlt, FaEdit } from 'react-icons/fa';
import { useSelector, useDispatch } from "react-redux";
import {fetchBusinesses} from '../slices/businessSlice.js';
import { setTitle } from '../slices/navbarSlice.js';

const UpdateBusiness = () => {
  const [gstin, setGstin] = useState(''); 
  const [skippedgstin, setSkippedGstin] = useState(''); 
  const [username,setUsername] = useState('');
  const [legalName, setLegalName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [shippingAddress1, setShippingAddress1] = useState('');
  const [shippingAddress2, setShippingAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [hsnCode, setHsnCode] = useState();
  const authToken = useSelector((state) => state.auth.authToken); // access from global auth state 
  const location = useLocation();
  const [showHsnPopup, setShowHsnPopup] = useState(false);
  const [availableHsnCodes, setAvailableHsnCodes] = useState([]); // HSN codes
  const [showAddressPopup, setShowAddressPopup] = useState(false); // State to control address popup visibility
  const [showAddSkippedBillPopup, setShowAddSkippedBillPopup] = useState(false); // State to control Add Skipped Bill popup visibility
  const [serialNo, setSerialNo] = useState('');
  const [date, setDate] = useState('');
  const [isUpdated, setIsUpdated] = useState(false); // State to track if the serial number was updated
  const { businesses } = useSelector((state) => state.business);
  const navigate = useNavigate();

  const dispatch = useDispatch();

   useEffect(()=>{

   dispatch(fetchBusinesses());

   const setNavTitle = () =>{
    dispatch(setTitle('My Business'));
  }

  setNavTitle();

   const getQueryParams = () => {
    return new URLSearchParams(location.search);
   };
   
   const fetchBusinessData = () => {
    const queryParams = getQueryParams();
    const Id = queryParams.get('id'); // Access the 'id' query parameter
    const business = businesses.find(b => b._id === Id); // Find the specific business by _id

    if (business) {
      setGstin(business.gstin);
      setUsername(business.gst_username);
      setLegalName(business.legal_name);
      setTradeName(business.trade_name);
      setShippingAddress1(business.shipping_address.address1);
      setShippingAddress2(business.shipping_address.address2);
      setCity(business.shipping_address.city);
      setState(business.shipping_address.state);
      setPincode(business.shipping_address.pincode);
      setAvailableHsnCodes(business.hsns);
      // Set other fields as necessary
    }
  };

  fetchBusinessData();

  },[location.search,businesses]);

  useEffect(() => {

    const fetchSnNo = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/mySnNo?gstin=${gstin}`, {
          headers: {
            Authorization: `Bearer ${authToken}`, // Include the auth token if required
          },
        });

        if (response.data.status) {
          const snNo = response.data.sn_no; // Extract the SN No from the response
          setSerialNo(snNo['2024-25']); // Set the serial number for the specific year
        } else {
          console.error('Failed to fetch SN No:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching SN No:', error);
      }
    };

    fetchSnNo(); // Call the function to fetch SN No when the component mounts or GSTIN changes
  }, [gstin, authToken]); // Dependency array includes gstin and authToken


  const handleShowHsnPopup = () => {
    setShowHsnPopup(true); // Show the popup
  };

  const handleShowAddressPopup = () => {
    setShowAddressPopup(true); // Show the address popup
  };

  const handleShowAddSkippedBillPopup = () => {
    setShowAddSkippedBillPopup(true); // Show the Add Skipped Bill popup
  };

  const handleAddHsnCode = async (hsnCode) =>{

    const requestBody = {
      gstin: gstin, // Use the current GSTIN
      hsn: hsnCode, // HSN code to be added
    };

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/user/hsn`, requestBody, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Include the auth token if required
          "Content-Type": "application/json",
        },
      });

    } catch (error) {
      console.error('Error updating serial number:', error);
      alert('Failed to Update Serial Number');
    }
    setHsnCode('');
    dispatch(fetchBusinesses());

  }

  const handleDeleteHsnCode = async (hsn) => {

    const requestBody = {
      gstin: gstin, // Use the current GSTIN
      hsn: hsn, // HSN code to be deleted
    };
   
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/user/hsn`, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Include the auth token if required
          "Content-Type": "application/json",
        },
        data: requestBody, // Include the request body
      });

    } catch (error) {
      console.error('Error deleting HSN code:', error);
      alert('Failed to delete HSN code');
    }

    dispatch(fetchBusinesses());
  };

  const handleEditSnNo = async () => {
    const requestBody = {
      sn_no: serialNo, // Use the current serial number
      gstin: gstin, // Include the GSTIN
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/mySnNo`, requestBody, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Include the auth token if required
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        console.log('Serial number updated successfully:', response.data);
        setIsUpdated(true); // Set the updated state to true
        setTimeout(() => setIsUpdated(false), 2000); // Reset the state after 2 seconds
      } else {
        console.error('Failed to update serial number:', response.data);
      }
    } catch (error) {
      console.error('Error updating serial number:', error);
      alert('Failed to Update Serial Number');
    }
  };

  const handleShippingAddress = async () =>{
    
    setShowAddressPopup(false);

    const requestBody = {
      gstin: gstin,
      address1: shippingAddress1,
      address2: shippingAddress2,
      pincode:pincode,
      state:state,
      city:city
    };

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/user/address`, requestBody, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Include the auth token if required
          "Content-Type": "application/json",
        },
      });

    } catch (error) {
      console.error('Error updating Shipping Address:', error);
      alert('Failed to Update Shipping Address');
    }

    dispatch(fetchBusinesses());
  }

  const handleSkippedBill = ()=>{
     if(skippedgstin && serialNo && date){
     navigate(`/gst-invoice?gstin=${skippedgstin}&s.no=${serialNo}&date=${date}`);
     }else{
     alert('Required Fields are missing !');
     }
  }


  return (
    <div className='p-8'>
     
     <div className="p-6 mt-5 mb-6 bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden">
      
      <div className="text-2xl font-bold text-gray-800 mt-3">
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
            <div className="flex items-center">
              <span className="font-semibold mr-2">Serial Number</span>
              <div className="flex items-center">
                <input
                  type="number"
                  className="border border-[#4154f1] rounded-lg p-1 w-1/3 text-gray-700"
                  value={serialNo}
                  onChange={(e) => setSerialNo(e.target.value)}
                />
                <button 
                  className="ml-2 text-blue-500 hover:text-blue-700"
                  onClick={handleEditSnNo} // Call the edit function on click
                >
                  {isUpdated ? <FaCheckCircle className="text-green-500" /> : <FaEdit />} {/* Show check icon if updated */}
                </button>
              </div>
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
            <div className="mb-4 border-b pb-4 h-48 overflow-y-auto"> {/* Added bottom border and padding */}
              {availableHsnCodes.map((code, index) => (
                <div key={index} className="flex justify-between items-center mb-2 p-2 hover:bg-gray-100 rounded"> {/* Added hover effect and padding */}
                  <span>{code.hsn}</span>
                  <FaTrashAlt 
                    className="text-red-500 cursor-pointer" 
                    onClick={() => handleDeleteHsnCode(code.hsn)} 
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
               <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200 w-full"
               onClick={()=>{handleAddHsnCode(hsnCode)}}
               >
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
                value={city} // Update to the correct state variable
                onChange={(e) => setCity(e.target.value)} 
              />
            </div>

            <div className="relative mb-4">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">State</span>
              <input
                type="text"
                className="w-full border border-[#4154f1] rounded-lg p-2"
                value={state} // Update to the correct state variable
                onChange={(e) => setState(e.target.value)} 
              />
            </div>

            <div className="relative mb-4">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">PinCode</span>
              <input
                type="text"
                className="w-full border border-[#4154f1] rounded-lg p-2"
                value={pincode} // Update to the correct state variable
                onChange={(e) => setPincode(e.target.value)} 
              />
            </div>

            <div className="flex space-x-4 mt-4">
              <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200 w-full" onClick={() => handleShippingAddress()}>
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
                value={skippedgstin}
                onChange={(e) => setSkippedGstin(e.target.value)} 
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
              <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200 w-full" onClick={()=>handleSkippedBill()}>
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
    </div>
  );
}

export default UpdateBusiness;
