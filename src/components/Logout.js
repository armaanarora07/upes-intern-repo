import React, { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../slices/authSlice.js";
import { setTitle } from "../slices/navbarSlice.js";

const Logout = () => {
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(()=>{
      dispatch(setTitle('Logout'));
  })

  const handleLogout = () => {
    // Clear user session
    dispatch(logout());
    navigate("/login"); // Redirect to login page
  
  };
  
  

  return (
    <div className="p-8 min-h-screen dark:bg-gray-800">
      <div className="mt-16">
          <div className="flex justify-center items-center">
            <div className="w-96 bg-white border border-gray-200 rounded-lg shadow-xl w-full max-w-lg p-8 text-center dark:bg-gray-800 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 text-center dark:text-gray-200">Logout</h2>
              <p className="text-gray-600 mt-2 dark:text-gray-200">
                Are you sure you want to log out?
              </p>

              <div className="mt-6">
                {!showConfirm ? (
                  <button
                    onClick={() => setShowConfirm(true)}
                    className="px-6 py-2 text-white bg-[#4154f1] hover:bg-red-600 rounded-md shadow-sm focus:outline-none dark:bg-blue-800 dark:text-gray-200 dark:hover:bg-blue-700 dark:border-blue-800"
                  >
                    Log Out
                  </button>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-200">Please confirm your action</p>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md shadow-md dark:bg-blue-800 dark:text-gray-200 dark:hover:bg-blue-700 dark:border-blue-800"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setShowConfirm(false)}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md shadow-md dark:bg-blue-800 dark:text-gray-200 dark:hover:bg-blue-700 dark:border-blue-800"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
        </div>
      </div>
    </div>
   
  );
};

export default Logout;
