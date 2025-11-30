import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { login, signup, verifyotp } from "../slices/authSlice.js";
import { setEway } from "../slices/ewaySlice.js";
import { setDate } from "../slices/validitySlice.js";
import FyntlLogo from "../assets/FyntlLogo1.png";

// Reusable Input Component - MUST be outside Login to prevent re-creation on every render
const InputField = ({ id, type = 'text', value, onChange, placeholder, label, prefix, disabled }) => (
  <div className="group">
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-indigo-600">
        {label}
      </label>
    )}
    <div className={prefix ? "flex" : ""}>
      {prefix && (
        <div className="flex items-center justify-center px-4 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 group-focus-within:border-indigo-500 group-focus-within:bg-indigo-50">
          {prefix}
        </div>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${prefix ? 'flex-1 min-w-0 rounded-l-none' : 'w-full'}`}
      />
    </div>
  </div>
);

const Login = () => {
  const [phone, setPhone] = useState("");
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(''));
  const [view, setView] = useState('login'); // 'login', 'otp', 'register', 'registerOtp'
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [initialAuth, setInitialAuth] = useState('');
  const authToken = useSelector((state) => state.auth.authToken);
  const verifiedotp = useSelector((state) => state.auth.otp);
  const otpRefs = useRef([]);

  // Validate phone number (Indian format)
  const isPhoneValid = () => /^[6-9]\d{9}$/.test(phone);

  // Validate OTP (6-digit numeric)
  const isOtpValid = () => otpDigits.every(digit => digit !== '') && otpDigits.join('').length === 6;

  // Handle phone input
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otpDigits];
    newOtp[index] = value;
    setOtpDigits(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).replace(/[^0-9]/g, '');
    if (pastedData.length === 6) {
      setOtpDigits(pastedData.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!isPhoneValid()) {
      setErrorMessage("Enter a valid 10-digit phone number.");
      return;
    }

    if (!termsAccepted) {
      setErrorMessage("You must accept the Terms & Conditions.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/login`, {
        contact: `+91${phone}`,
      });

      if (response.status === 200 && response.data.authToken) {
        setInitialAuth(response.data.authToken);
        setSuccessMessage("OTP sent! Check your messages.");
        setResendTimer(60);
        setLoading(false);
        setView('otp');
      } else {
        setErrorMessage("Failed to send OTP. Try again.");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      if(error.response?.data?.message === "User is not registered .."){
         setErrorMessage("User is not Registered. Please register to continue !");
      }else{
        setErrorMessage("Error Sending OTP. Try again.");
      }
      setLoading(false);
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

    setLoading(true);
    const otpValue = otpDigits.join('');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/optVerification`,
        { otp: otpValue },
        {
          headers: { Authorization: `Bearer ${initialAuth}` },
        }
      );

      if (response.status === 200 && response.data.authToken) {
        dispatch(login(response.data.authToken));
        dispatch(setEway(response.data.user.eway_enabled));
        dispatch(setDate(response.data.user.subscription_till))
        dispatch(verifyotp(true));
        setSuccessMessage("OTP verified successfully.");
        setLoading(false);
        navigate("/dashboard");
      } else {
        setErrorMessage("OTP verification failed. Try again.");
        setLoading(false);
      }
    } catch (error) {
      setErrorMessage("Error verifying OTP. Try again.");
      setLoading(false);
    }
  };

  // Handle Register Phone Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!isPhoneValid()) {
      setErrorMessage("Enter a valid 10-digit phone number.");
      return;
    }

    if (!termsAccepted) {
      setErrorMessage("You must accept the Terms & Conditions.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/verify`, {
        contact: `+91${phone}`,
      });

      if (response.status === 200 && response.data.authToken) {
        setInitialAuth(response.data.authToken);
        setSuccessMessage("Verification code sent! Check your messages.");
        setResendTimer(60);
        setLoading(false);
        setView('registerOtp');
      } else {
        setErrorMessage("Failed to send verification code. Try again.");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response?.data?.message || "Error sending verification code. Try again.");
      setLoading(false);
    }
  };

  // Handle Register OTP Submit
  const handleRegisterOtpSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!isOtpValid()) {
      setErrorMessage("Enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    const otpValue = otpDigits.join('');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/optVerification`,
        { otp: otpValue },
        {
          headers: { Authorization: `Bearer ${initialAuth}` },
        }
      );

      if (response.status === 200 && response.data.authToken) {
        dispatch(signup(response.data.authToken));
        dispatch(setEway(response.data.user.eway_enabled));
        dispatch(verifyotp(true));
        setSuccessMessage("Registration successful!");
        setLoading(false);
        navigate("/add-business");
      } else {
        setErrorMessage("OTP verification failed. Try again.");
        setLoading(false);
      }
    } catch (error) {
      setErrorMessage("Error verifying OTP. Try again.");
      setLoading(false);
    }
  };

  // Resend OTP Timer
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  useEffect(() => {
    if (authToken && verifiedotp) {
      navigate("/dashboard");
    }
  }, [authToken, verifiedotp, navigate]);

  // Reusable Button Component
  const Button = ({ children, onClick, disabled, btnLoading, variant = 'primary', className = '' }) => {
    const baseClasses = "w-full py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 ease-in-out";
    const variants = {
      primary: "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-300/50 focus:ring-indigo-500 active:bg-indigo-800",
      secondary: "text-indigo-600 font-medium hover:text-indigo-800 hover:bg-indigo-50 focus:ring-indigo-500",
      link: "text-indigo-600 font-medium text-sm hover:text-indigo-800 hover:underline focus:ring-indigo-500"
    };
    
    return (
      <button
        onClick={onClick}
        disabled={disabled || btnLoading}
        className={`${baseClasses} ${variants[variant]} ${className}`}
      >
        {btnLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="animate-pulse">Loading...</span>
          </span>
        ) : children}
      </button>
    );
  };

  // Login View
  const renderLogin = () => (
    <motion.div
      key="login"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="space-y-6"
    >
      <div>
        <InputField
          id="phone"
          type="tel"
          value={phone}
          onChange={handlePhoneChange}
          placeholder="Enter 10-digit number"
          label="Phone Number"
          prefix="+91"
        />
      </div>

      <div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={() => setTermsAccepted(!termsAccepted)}
            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            I accept the{" "} 
            <a
              href="https://sangrahinnovations.com/TC-Sangrah.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors duration-200"
            >
              Terms & Conditions
            </a>
            {" "}and{" "}
            <a
              href="https://sangrahinnovations.com/privacy.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors duration-200"
            >
              Privacy Policy
            </a>
          </label>
        </div>
      </div>

      <div>
        <Button onClick={handlePhoneSubmit} btnLoading={loading} disabled={!termsAccepted}>
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </Button>
      </div>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button 
            onClick={() => { setView('register'); setPhone(''); setTermsAccepted(false); setErrorMessage(''); setSuccessMessage(''); }} 
            className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline transition-colors duration-200"
          >
            Register here
          </button>
        </p>
      </div>
    </motion.div>
  );

  // OTP View
  const renderOTP = () => (
    <motion.div
      key="otp"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="text-center mb-4">
        <p className="text-gray-600 animate-slideInFromTop">
          We've sent a verification code to <span className="font-medium text-indigo-600">+91 {phone}</span>
        </p>
      </div>
      
      <div className="flex justify-center space-x-3 animate-slideInFromBottom">
        {otpDigits.map((digit, index) => (
          <input
            key={index}
            ref={el => otpRefs.current[index] = el}
            type="text"
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(index, e)}
            onPaste={handleOtpPaste}
            maxLength={1}
            className={`w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg transition-all duration-300 ease-in-out hover:shadow-md hover:shadow-gray-300/50 hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:shadow-lg focus:shadow-indigo-200/50 focus:outline-none transform hover:scale-110 focus:scale-110 ${digit ? 'bg-indigo-50 border-indigo-300' : ''}`}
          />
        ))}
      </div>
      
      <div className="animate-slideInFromBottom" style={{ animationDelay: '200ms' }}>
        <Button onClick={handleOtpSubmit} btnLoading={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </Button>
      </div>
      
      <div className="text-center mt-4 animate-fadeIn" style={{ animationDelay: '300ms' }}>
        <p className="text-sm text-gray-600">
          Didn't receive the code?{' '}
          <button 
            onClick={resendTimer === 0 ? handlePhoneSubmit : undefined} 
            disabled={resendTimer > 0 || loading} 
            className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
          </button>
        </p>
      </div>
      
      <div className="text-center mt-2 animate-fadeIn" style={{ animationDelay: '400ms' }}>
        <button 
          onClick={() => { setView('login'); setOtpDigits(Array(6).fill('')); setErrorMessage(''); setSuccessMessage(''); }} 
          className="text-indigo-600 font-medium text-sm hover:text-indigo-800 hover:underline transition-colors duration-200"
        >
          ← Back to login
        </button>
      </div>
    </motion.div>
  );

  // Register View
  const renderRegister = () => (
    <motion.div
      key="register"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="space-y-6"
    >
      <div>
        <InputField
          id="registerPhone"
          type="tel"
          value={phone}
          onChange={handlePhoneChange}
          placeholder="Enter 10-digit number"
          label="Phone Number"
          prefix="+91"
        />
      </div>

      <div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="registerTerms"
            checked={termsAccepted}
            onChange={() => setTermsAccepted(!termsAccepted)}
            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
          />
          <label htmlFor="registerTerms" className="text-sm text-gray-600">
            I accept the{" "} 
            <a
              href="https://sangrahinnovations.com/TC-Sangrah.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors duration-200"
            >
              Terms & Conditions
            </a>
            {" "}and{" "}
            <a
              href="https://sangrahinnovations.com/privacy.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors duration-200"
            >
              Privacy Policy
            </a>
          </label>
        </div>
      </div>

      <div>
        <Button onClick={handleRegisterSubmit} btnLoading={loading} disabled={!termsAccepted}>
          {loading ? 'Sending Code...' : 'Sign Up'}
        </Button>
      </div>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button 
            onClick={() => { setView('login'); setPhone(''); setTermsAccepted(false); setErrorMessage(''); setSuccessMessage(''); }} 
            className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline transition-colors duration-200"
          >
            Login here
          </button>
        </p>
      </div>
    </motion.div>
  );

  // Register OTP View
  const renderRegisterOTP = () => (
    <motion.div
      key="registerOtp"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="text-center mb-4">
        <p className="text-gray-600 animate-slideInFromTop">
          We've sent a verification code to <span className="font-medium text-indigo-600">+91 {phone}</span>
        </p>
      </div>
      
      <div className="flex justify-center space-x-3 animate-slideInFromBottom">
        {otpDigits.map((digit, index) => (
          <input
            key={index}
            ref={el => otpRefs.current[index] = el}
            type="text"
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(index, e)}
            onPaste={handleOtpPaste}
            maxLength={1}
            className={`w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg transition-all duration-300 ease-in-out hover:shadow-md hover:shadow-gray-300/50 hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:shadow-lg focus:shadow-indigo-200/50 focus:outline-none transform hover:scale-110 focus:scale-110 ${digit ? 'bg-indigo-50 border-indigo-300' : ''}`}
          />
        ))}
      </div>
      
      <div className="animate-slideInFromBottom" style={{ animationDelay: '200ms' }}>
        <Button onClick={handleRegisterOtpSubmit} btnLoading={loading}>
          {loading ? 'Verifying...' : 'Verify & Register'}
        </Button>
      </div>
      
      <div className="text-center mt-4 animate-fadeIn" style={{ animationDelay: '300ms' }}>
        <p className="text-sm text-gray-600">
          Didn't receive the code?{' '}
          <button 
            onClick={resendTimer === 0 ? handleRegisterSubmit : undefined} 
            disabled={resendTimer > 0 || loading} 
            className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
          </button>
        </p>
      </div>
      
      <div className="text-center mt-2 animate-fadeIn" style={{ animationDelay: '400ms' }}>
        <button 
          onClick={() => { setView('register'); setOtpDigits(Array(6).fill('')); setErrorMessage(''); setSuccessMessage(''); }} 
          className="text-indigo-600 font-medium text-sm hover:text-indigo-800 hover:underline transition-colors duration-200"
        >
          ← Back to registration
        </button>
      </div>
    </motion.div>
  );

  const titles = {
    login: { title: 'Welcome to Fyntl-AI', subtitle: 'Login with your phone number' },
    otp: { title: 'Welcome to Fyntl-AI', subtitle: 'Enter verification code' },
    register: { title: 'Join Fyntl-AI Now!', subtitle: 'Sign up with phone number and be part of something amazing' },
    registerOtp: { title: 'Welcome to Fyntl-AI', subtitle: 'Verify your phone number' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl hover:shadow-2xl"
        style={{ overflow: "hidden" }}
      >
        {/* Header - Static */}
        <div className="bg-indigo-600 p-6 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img 
              src={FyntlLogo} 
              alt="Fyntl-AI Logo" 
              className="h-12 w-auto"
            />
          </div>
          
          {/* Title and Subtitle */}
          <h1 className="text-2xl font-bold text-white">
            {titles[view].title}
          </h1>
          <p className="text-indigo-200 mt-2">
            {titles[view].subtitle}
          </p>
        </div>
        
        {/* Content Wrapper - Dynamic with Layout Animation */}
        <motion.div
          layout
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ overflow: "hidden" }}
          className="p-6"
        >
          {/* Main Content - Wait Mode Enforced */}
          <AnimatePresence mode="wait">
            {view === 'login' && renderLogin()}
            {view === 'otp' && renderOTP()}
            {view === 'register' && renderRegister()}
            {view === 'registerOtp' && renderRegisterOTP()}
          </AnimatePresence>
          
          {/* Messages - Wait Mode Enforced */}
          <AnimatePresence mode="wait">
            {errorMessage && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{successMessage}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Footer - Static */}
        <div className="bg-gray-50 px-6 py-4 text-center text-xs text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
