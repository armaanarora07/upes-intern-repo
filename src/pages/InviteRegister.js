import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { signup, verifyotp } from "../slices/authSlice.js";
import { setEway } from "../slices/ewaySlice.js";

const InviteRegister = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [token, setToken] = useState("");
  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [initialAuth, setInitialAuth] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  // Extract the token from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [location.search]);
  
  // Validate contact (Indian phone number format)
  const isContactValid = () => /^[6-9]\d{9}$/.test(contact);
  // Validate OTP (6-digit)
  const isOtpValid = () => /^\d{6}$/.test(otp);
  
  // STEP 1: Send OTP
  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    
    if (fullName.trim() === "") {
      setErrorMessage("Full name is required.");
      return;
    }
    if (!isContactValid()) {
      setErrorMessage("Enter a valid 10-digit contact number.");
      return;
    }
    
    setLoading(true);
    try {

      const payload = {
        token: token,
        full_name: fullName,
        contact: `+91${contact}`
      };
  
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/register`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200 && response.data.authToken) {
        setInitialAuth(response.data.authToken);
        setStep(2);
        setSuccessMessage("OTP sent. Please check your messages.");
      } else {
        setErrorMessage("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while sending OTP. Please try again later.");
    }
    setLoading(false);
  };
  
  // STEP 2: Verify OTP & Register
  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    
    if (!isOtpValid()) {
      setErrorMessage("Enter a valid 6-digit OTP.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/optVerification`,
        { otp },
        {
          headers: { Authorization: `Bearer ${initialAuth}` },
        }
      );
      if (response.status === 200 && response.data.authToken) {
        dispatch(signup(response.data.authToken));
        dispatch(setEway(response.data.user.eway_enabled));
        dispatch(verifyotp(true));
        setSuccessMessage(response.data.message || "Registration successful!");
        navigate("/add-business");
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred during registration.");
    }
    setLoading(false);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="relative w-full max-w-lg p-8 space-y-8 bg-white border rounded-lg shadow-xl border-gray-200 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-105">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-[#1E1E2D]">
            Welcome to Fyntl-AI
          </h2>
          <p className="mt-2 text-gray-600">Register to continue</p>
        </div>

        <form onSubmit={step === 1 ? handleStep1Submit : handleStep2Submit} className="space-y-6">
            <div>
                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullname"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-4 focus:ring-blue-300 transition duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-gray-100 text-gray-600 rounded-md">+91</span>
                  <input
                    type="tel"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 bg-white border rounded-md"
                    disabled={step === 2}
                  />
                </div>
              </div>

          {step === 1 && (
            <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms(!acceptedTerms)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I accept the{" "}
              <a
                href="https://sangrahinnovations.com/privacy.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Terms & Conditions
              </a>
            </label>
          </div>
          )}

          {step === 2 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the 6-digit OTP"
                className="w-full px-4 py-3 bg-white border rounded-md"
              />
            </div>
          )}

          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
          {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

          <button type="submit"
            disabled={step === 1 && !acceptedTerms}
            className={`w-full py-3 text-lg font-bold text-white rounded-md shadow-lg transform transition duration-300 ${
              step === 1 && !acceptedTerms
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:scale-105"
            }`}>
            {step === 1 ? "Register" : "Verify OTP"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">Already have an account?</p>
          <a
            href="/login"
            className="font-bold text-blue-500 hover:underline transition duration-200"
          >
            Login Here
          </a>
        </div>
      </div>
    </div>
  );
};

export default InviteRegister;
