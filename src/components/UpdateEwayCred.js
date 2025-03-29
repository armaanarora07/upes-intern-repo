import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setEway } from "../slices/ewaySlice";
import { setTitle } from "../slices/navbarSlice";

const UpdateEwayCred = () => {
  const [credentials, setCredentials] = useState({ x: "", y: "" });
  const authToken = useSelector((state) => state.auth.authToken); // access from global auth state 
  const ewayEnabled = useSelector((state) => state.eway.eway_enabled); // access from global eway state 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirect to another page when service is enabled
  useEffect(() => {

    if (!ewayEnabled) {
        navigate("/eway-bills"); // Redirect to the next page after service is enabled
    }
    const setNavTitle = () =>{
      dispatch(setTitle('Update E-Way Services'));
    }

    setNavTitle();
  }, [setTitle, dispatch, ewayEnabled, navigate]);

  const handleEnableService = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/user/eway_setup`,
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
    <div className="p-8 min-h-screen dark:bg-gray-800">
          <div className="flex flex-col items-center justify-center mt-10 ">
                <form onSubmit={handleEnableService} className="p-6 mt-5 mb-6 bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                  
                  <h2 className="text-2xl font-bold text-gray-800 text-center mb-4 dark:text-gray-200">Update E-Way Services</h2>

                  <input
                    type="text"
                    placeholder="E-Way User Id"
                    value={credentials.x}
                    onChange={(e) => setCredentials({ ...credentials, x: e.target.value })}
                    className="w-full p-2 border rounded-lg mb-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
                    required
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    value={credentials.y}
                    onChange={(e) => setCredentials({ ...credentials, y: e.target.value })}
                    className="w-full p-2 border rounded-lg mb-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
                    required
                  />
                   <div className='flex justify-center mt-4'>
                      <button 
                        type="submit" 
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200 dark:bg-blue-800 dark:text-gray-200 dark:hover:bg-blue-700 dark:border-blue-800"
                      >
                        Update Credentials
                      </button>
                  </div>
                </form>
          </div>
    </div>
  );
};

export default UpdateEwayCred;
