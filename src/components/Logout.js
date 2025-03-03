import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../slices/authSlice.js";

const Logout = () => {
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Clear user session
    dispatch(logout());
    navigate("/login"); // Redirect to login page
  
  };
  
  

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-sm">
        <h2 className="text-2xl font-semibold text-gray-800">Logout</h2>
        <p className="text-gray-600 mt-2">
          Are you sure you want to log out?
        </p>

        <div className="mt-6">
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="px-6 py-2 text-white bg-[#4154f1] hover:bg-red-600 rounded-md shadow-sm focus:outline-none"
            >
              Log Out
            </button>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-700">Please confirm your action:</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md shadow-md"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md shadow-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Logout;
