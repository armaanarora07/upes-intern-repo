import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {FaFileAlt} from 'react-icons/fa';
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setEway } from "../slices/ewaySlice";
import { setTitle } from "../slices/navbarSlice";

const EWayBillSystem = () => {
  const [credentials, setCredentials] = useState({ x: "", y: "" });
  const navigate = useNavigate(); // Initialize navigation
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.authToken); // access from global auth state 
  const ewayEnabled = useSelector((state) => state.eway.eway_enabled); // access from global eway state 
  const [serviceEnabled, setServiceEnabled] = useState(ewayEnabled);
  const enable = useSelector((state)=> state.eway.enable);
  const [status,setStatus] = useState(false);

  // Redirect to another page when service is enabled
  useEffect(() => {

    if(enable) {

      if (ewayEnabled) {
        navigate("/eway-transactions"); // Redirect to the next page after service is enabled
      }

    }else{

      setStatus(true);

    }
    
    const setNavTitle = () =>{
      dispatch(setTitle('Activate E-Way Services'));
    }

    setNavTitle();
  }, [setTitle, dispatch, ewayEnabled, navigate, enable]);

  const handleEnableService = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://fyntl.sangrahinnovations.com/user/eway_setup",
        {
          x: credentials.x.trim(),
          y: credentials.y.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status) {
        dispatch(setEway(true));
        alert("Services enabled: " + response.data.message);
      } else {
        alert(response.data.message || "Setup failed");
      }
    } catch (error) {
      console.error("Setup Error:", error);
      alert(error.response?.data?.message || "Error in eWay setup");
    }
  };

  return (
    <div className="p-8 mt-10">
          <div className="flex flex-col items-center justify-center mt-10">
              {serviceEnabled && status ? (

                <div className='p-6 bg-white rounded-lg shadow-xl mt-5'>
                  <h2 className="text-2xl font-bold text-gray-800 flex justify-center">Please Enable E-way in the Settings !</h2>
                </div>

              ) : (
                <form onSubmit={handleEnableService} className="bg-white p-6 rounded-lg shadow-md w-96">
                  <h2 className="text-xl font-bold mb-4">Activate E-Way Services</h2>

                  <input
                    type="text"
                    placeholder="API Key (X Value)"
                    value={credentials.x}
                    onChange={(e) => setCredentials({ ...credentials, x: e.target.value })}
                    className="w-full p-2 border rounded mb-2"
                    required
                  />

                  <input
                    type="password"
                    placeholder="Secret Key (Y Value)"
                    value={credentials.y}
                    onChange={(e) => setCredentials({ ...credentials, y: e.target.value })}
                    className="w-full p-2 border rounded mb-2"
                    required
                  />

                  <button 
                    type="submit" 
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                  >
                    Activate Services
                  </button>
                </form>
              )}
          </div>
    </div>
  );
};

export default EWayBillSystem;
