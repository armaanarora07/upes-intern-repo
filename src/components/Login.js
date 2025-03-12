import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, verifyotp } from "../slices/authSlice.js";
import { setEway } from "../slices/ewaySlice.js";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
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
    setErrorMessage(""); // Reset errors

    if (!isPhoneValid()) {
      setErrorMessage("Enter a valid 10-digit phone number.");
      return;
    }

    if (!termsAccepted) {
      setErrorMessage("You must accept the Terms & Conditions.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/login`, {
        contact: `+91${phone}`,
      });

      if (response.status === 200 && response.data.authToken) {
        setInitialAuth(response.data.authToken);
        setStep(2);
        setSuccessMessage("OTP sent! Check your messages.");
      } else {
        setErrorMessage("Failed to send OTP. Try again.");
      }
    } catch (error) {
      setErrorMessage("Error sending OTP. Try again later.");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset errors

    if (!isOtpValid()) {
      setErrorMessage("Enter a valid 6-digit OTP.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/optVerification`,
        { otp },
        {
          headers: { Authorization: `Bearer ${initialAuth}` },
        }
      );

      if (response.status === 200 && response.data.authToken) {
        dispatch(login(response.data.authToken));
        dispatch(setEway(response.data.user.eway_enabled));
        dispatch(verifyotp(true));
        setSuccessMessage("OTP verified successfully.");
        navigate("/dashboard");
      } else {
        setErrorMessage("OTP verification failed. Try again.");
      }
    } catch (error) {
      setErrorMessage("Error verifying OTP. Try again.");
    }
  };

  useEffect(() => {
    if (authToken && verifiedotp) {
      navigate("/dashboard");
    }
  }, [authToken, verifiedotp, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="relative w-full max-w-lg p-8 space-y-8 bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-105">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-[#1E1E2D]">
            Welcome to Fyntl-AI
          </h2>
          <p className="mt-2 text-gray-600">Login to continue</p>
        </div>

        <form onSubmit={step === 1 ? handlePhoneSubmit : handleOtpSubmit} className="space-y-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-gray-100 text-gray-600 rounded-md">
                +91
              </span>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-4 focus:ring-blue-300 transition duration-300"
                disabled={step === 2}
              />
            </div>
          </div>

          {step === 2 && (
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the 6-digit OTP"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-4 transition duration-300"
              />
            </div>
          )}

          {step === 1 && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
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

          {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
          {successMessage && <p className="text-sm text-green-500">{successMessage}</p>}

          <button
            type="submit"
            disabled={step === 1 && !termsAccepted}
            className={`w-full py-3 text-lg font-bold text-white rounded-md shadow-lg transform transition duration-300 ${
              step === 1 && !termsAccepted
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:scale-105"
            }`}
          >
            {step === 1 ? "Login" : "Verify OTP"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">Don't have an account?</p>
          <a href="/signup" className="font-bold text-blue-500 hover:underline transition duration-200">
            Sign Up Here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
