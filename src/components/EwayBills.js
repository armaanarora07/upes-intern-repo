import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setEway } from "../slices/ewaySlice";

const EWayBillSystem = () => {
  const [serviceEnabled, setServiceEnabled] = useState(false);
  const [credentials, setCredentials] = useState({ x: "", y: "" });
  const navigate = useNavigate(); // Initialize navigation
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.authToken); // access from global auth state 
  const ewayEnabled = useSelector((state) => state.eway.eway_enabled); // access from global eway state 

  /* Check service status on component mount
  useEffect(() => {
    const storedStatus = localStorage.getItem("ewayEnabled");
    if (storedStatus === "true") {
      setServiceEnabled(true);
    } else {
      checkServiceStatus();
    }
  }, []);

  */

  // Redirect to another page when service is enabled
  useEffect(() => {
    console.log(ewayEnabled);
    if (ewayEnabled) {
      navigate("/EWayBillRequest"); // Redirect to the next page after service is enabled
      console.log("Service Enabled:", ewayEnabled);

    }
  }, [ewayEnabled, navigate]);

  const checkServiceStatus = async () => {
    try {
      const response = await axios.get(
        "https://fyntl.sangrahinnovations.com/user/eway_status",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.status) {
        setServiceEnabled(true);
        localStorage.setItem("ewayEnabled", "true");
      } else {
        setServiceEnabled(false);
        localStorage.removeItem("ewayEnabled");
      }
    } catch (error) {
      console.log("Service status check failed");
    }
  };

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
        //setServiceEnabled(true);
        //localStorage.setItem("ewayEnabled", "true");
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {serviceEnabled ? (
        <div>Loading...</div> // Show loading state until redirected
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
  );
};

export default EWayBillSystem;
