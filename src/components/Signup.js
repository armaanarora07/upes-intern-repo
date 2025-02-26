import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { useDispatch } from "react-redux";
import { signup, verifyotp } from "../slices/authSlice.js";
import { useSelector } from "react-redux";

const SignUp = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); 
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Hook to dispatch the authToken
  const authToken = useSelector((state) => state.auth.authToken); //// Store initial authToken - access from global auth state 
  const verifiedotp = useSelector((state) => state.auth.otp);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();

    if (!phone || phone.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      const response = await axios.post("https://fyntl.sangrahinnovations.com/user/verify", {
        contact: `+91${phone}`,
      });

      if (response.status === 200 && response.data.authToken) {
        dispatch(signup(response.data.authToken));
        setStep(2); 
        setSuccessMessage("Verification code sent. Please check your messages.");
        setErrorMessage(""); 
      } else {
        setErrorMessage("Failed to send verification code. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while sending verification code. Please try again later.");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      const response = await axios.post(
        "https://fyntl.sangrahinnovations.com/user/optVerification",
        { otp: otp }, 
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200 && response.data.authToken) {
        dispatch(signup(response.data.authToken));
        dispatch(verifyotp(true));
        setSuccessMessage("OTP verified successfully.");
        setErrorMessage("");
        navigate("/add-business");
      } else {
        setErrorMessage("OTP verification failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while verifying OTP. Please try again later.");
    }
  };

  useEffect(()=>{
  
      const checkAuth = ()=>{
          if(authToken && verifiedotp){
            navigate("/dashboard");
          }
      }
  
      checkAuth();
    })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center px-4">
      <div className="relative w-full max-w-lg p-8 space-y-8 bg-white bg-opacity-90 rounded-3xl shadow-xl transform transition-all duration-500 hover:shadow-2xl hover:scale-105">
        
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4154f1] to-black">
            Join ScanT Now!
          </h2>
          <p className="mt-2 text-gray-600">Sign up and be part of something amazing</p>
        </div>

        <form onSubmit={step === 1 ? handlePhoneSubmit : handleOtpSubmit} className="space-y-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-gray-100 text-gray-600 rounded-l-full">
                +91
              </span>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 bg-white bg-opacity-80 border border-gray-300 rounded-r-full shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300"
                disabled={step === 2} 
              />
            </div>
            {errorMessage && <p className="mt-2 text-sm text-red-500">{errorMessage}</p>}
          </div>

          {step === 2 && (
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Enter OTP</label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the 6-digit OTP"
                className="w-full px-4 py-3 bg-white bg-opacity-80 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300"
              />
              {errorMessage && <p className="mt-2 text-sm text-red-500">{errorMessage}</p>}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 text-lg font-bold text-white bg-gradient-to-r from-[#4154f1] to-black rounded-full shadow-lg hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-400 transform hover:scale-105 transition duration-300"
          >
            {step === 1 ? "Sign Up" : "Verify OTP"}
          </button>
        </form>

        {/* Success message */}
        {successMessage && <p className="mt-4 text-center text-green-500">{successMessage}</p>}

        {/* Login link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">Already have an account?</p>
          <a
            href="/login"
            className="font-bold text-blue-500 hover:text-blue-600 hover:underline transition duration-200"
          >
            Login Here
          </a>
        </div>

        {/* Inspirational quote */}
        <div className="mt-8 text-center">
          <blockquote className="text-sm italic text-gray-500">
            "The future belongs to those who believe in the beauty of their dreams."
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
