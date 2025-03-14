import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup, verifyotp } from "../slices/authSlice.js";
import { setEway } from "../slices/ewaySlice.js";

const SignUp = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [initialAuth,setInitialAuth] = useState('');
  const authToken = useSelector((state) => state.auth.authToken);
  const verifiedotp = useSelector((state) => state.auth.otp);


   // Validate phone number (Indian format)
   const isPhoneValid = () => /^[6-9]\d{9}$/.test(phone);

   // Validate OTP (6-digit numeric)
   const isOtpValid = () => /^\d{6}$/.test(otp);
 
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!isPhoneValid()) {
      setErrorMessage("Enter a valid 10-digit phone number.");
      return;
    }

    if (!acceptedTerms) {
      setErrorMessage("You must accept the Terms and Conditions.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/verify`, {
        contact: `+91${phone}`,
      });

      if (response.status === 200 && response.data.authToken) {
        setInitialAuth(response.data.authToken);
        setStep(2);
        setSuccessMessage("Verification code sent. Please check your messages.");
      } else {
        setErrorMessage("Failed to send verification code. Please try again.");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred while sending verification code. Please try again later.");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!isOtpValid()) {
      setErrorMessage("Enter a valid 6-digit OTP.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/optVerification`,
        { otp: otp },
        {
          headers: {
            Authorization: `Bearer ${initialAuth}`,
          },
        }
      );

      if (response.status === 200 && response.data.authToken) {
        dispatch(signup(response.data.authToken));
        dispatch(setEway(response.data.user.eway_enabled));
        dispatch(verifyotp(true));
        setSuccessMessage("OTP verified successfully.");
        navigate("/add-business");
      } else {
        setErrorMessage("OTP verification failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while verifying OTP. Please try again later.");
    }
  };

  useEffect(() => {
    if (authToken && verifiedotp) {
      navigate("/dashboard");
    }
  }, [authToken, verifiedotp, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="relative w-full max-w-lg p-8 space-y-8 bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden shadow-xl">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-[#1E1E2D]">
            Join Fyntl-AI Now!
          </h2>
          <p className="mt-2 text-gray-600">Sign up and be part of something amazing</p>
        </div>

        <form onSubmit={step === 1 ? handlePhoneSubmit : handleOtpSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-gray-100 text-gray-600 rounded-md">+91</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
                  href="https://sangrahinnovations.com/TC-Sangrah.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Terms & Conditions
                </a>
                {" "}and{" "}
                <a
                  href="https://sangrahinnovations.com/privacy.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Privacy Policy
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
            {step === 1 ? "Sign Up" : "Verify OTP"}
          </button>
           
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

        </form>
      </div>
    </div>
  );
};

export default SignUp;
