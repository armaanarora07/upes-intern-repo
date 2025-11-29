import { useState, useEffect, useRef } from 'react';

const LoginPage = () => {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [view, setView] = useState('login');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef([]);

  // ============================================
  // HANDLERS
  // ============================================
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 10) {
      setPhoneNumber(value);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).replace(/[^0-9]/g, '');
    if (pastedData.length === 6) {
      setOtp(pastedData.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  const handleRegisterInputChange = (field, value) => {
    setRegisterData(prev => ({ ...prev, [field]: value }));
  };

  // ============================================
  // API FUNCTIONS (Replace with actual API calls)
  // ============================================
  const sendOtp = async () => {
    if (phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setLoading(true);
    setError('');
    
    // TODO: Replace with actual API call
    // const response = await fetch('/api/send-otp', {
    //   method: 'POST',
    //   body: JSON.stringify({ phoneNumber })
    // });
    
    setTimeout(() => {
      setLoading(false);
      setView('otp');
      setResendTimer(60);
    }, 1500);
  };

  const verifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    setLoading(true);
    setError('');
    
    // TODO: Replace with actual API call
    // const response = await fetch('/api/verify-otp', {
    //   method: 'POST',
    //   body: JSON.stringify({ phoneNumber, otp: otpValue })
    // });
    
    setTimeout(() => {
      setLoading(false);
      alert('Login successful!');
      resetForms();
      setView('login');
    }, 1500);
  };

  const handleRegister = async () => {
    const { name, email, password, confirmPassword } = registerData;
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // TODO: Replace with actual API call
    // const response = await fetch('/api/register', {
    //   method: 'POST',
    //   body: JSON.stringify(registerData)
    // });
    
    setTimeout(() => {
      setLoading(false);
      alert('Registration successful! Please login with your phone number.');
      setView('login');
      resetForms();
    }, 1500);
  };

  const resetForms = () => {
    setPhoneNumber('');
    setOtp(Array(6).fill(''));
    setRegisterData({ name: '', email: '', password: '', confirmPassword: '' });
    setError('');
  };

  // ============================================
  // EFFECTS
  // ============================================
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // ============================================
  // RENDER HELPERS
  // ============================================
  const Button = ({ children, onClick, disabled, loading: btnLoading, variant = 'primary', className = '' }) => {
    const baseClasses = "w-full py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100";
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

  const Input = ({ id, type = 'text', value, onChange, placeholder, label, prefix }) => (
    <div className="group">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1 transition-colors duration-200 group-focus-within:text-indigo-600">
          {label}
        </label>
      )}
      <div className={prefix ? "flex" : ""}>
        {prefix && (
          <div className="flex items-center justify-center px-4 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 transition-all duration-300 group-focus-within:border-indigo-500 group-focus-within:bg-indigo-50">
            {prefix}
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`px-4 py-3 border border-gray-300 rounded-lg transition-all duration-300 ease-in-out hover:shadow-md hover:shadow-gray-300/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:shadow-lg focus:shadow-indigo-200/50 focus:outline-none transform hover:scale-[1.02] focus:scale-[1.02] ${prefix ? 'flex-1 min-w-0 rounded-l-none' : 'w-full'}`}
        />
      </div>
    </div>
  );

  // ============================================
  // VIEW RENDERS
  // ============================================
  const renderLogin = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="animate-slideInFromTop">
        <Input
          id="phone"
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder="Enter 10-digit number"
          label="Phone Number"
          prefix="+91"
        />
      </div>
      <div className="animate-slideInFromBottom" style={{ animationDelay: '200ms' }}>
        <Button onClick={sendOtp} loading={loading}>
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </Button>
      </div>
      <div className="text-center mt-4 animate-fadeIn" style={{ animationDelay: '300ms' }}>
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Button onClick={() => setView('register')} variant="secondary" className="p-0 w-auto">
            Register here
          </Button>
        </p>
      </div>
    </div>
  );

  const renderOTP = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center mb-4">
        <p className="text-gray-600 animate-slideInFromTop">
          We've sent a verification code to <span className="font-medium text-indigo-600">+91 {phoneNumber}</span>
        </p>
      </div>
      <div className="flex justify-center space-x-3 animate-slideInFromBottom">
        {otp.map((digit, index) => (
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
        <Button onClick={verifyOtp} loading={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </Button>
      </div>
      <div className="text-center mt-4 animate-fadeIn" style={{ animationDelay: '300ms' }}>
        <p className="text-sm text-gray-600">
          Didn't receive the code?{' '}
          <Button onClick={sendOtp} disabled={resendTimer > 0 || loading} variant="secondary" className="p-0 w-auto">
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
          </Button>
        </p>
      </div>
      <div className="text-center mt-2 animate-fadeIn" style={{ animationDelay: '400ms' }}>
        <Button onClick={() => { setView('login'); setOtp(Array(6).fill('')); }} variant="link" className="w-auto">
          ← Back to login
        </Button>
      </div>
    </div>
  );

  const renderRegister = () => (
    <div className="space-y-4 animate-fadeIn">
      {[
        { key: 'name', type: 'text', placeholder: 'Enter your name', label: 'Full Name' },
        { key: 'email', type: 'email', placeholder: 'Enter your email', label: 'Email Address' },
        { key: 'password', type: 'password', placeholder: 'Create a password', label: 'Password' },
        { key: 'confirmPassword', type: 'password', placeholder: 'Confirm your password', label: 'Confirm Password' }
      ].map((field, index) => (
        <div key={field.key} className="animate-slideInFromLeft" style={{ animationDelay: `${index * 100}ms` }}>
          <Input
            id={field.key}
            type={field.type}
            value={registerData[field.key]}
            onChange={(e) => handleRegisterInputChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            label={field.label}
          />
        </div>
      ))}
      <div className="animate-slideInFromBottom" style={{ animationDelay: '400ms' }}>
        <Button onClick={handleRegister} loading={loading} className="mt-4">
          {loading ? 'Creating Account...' : 'Register'}
        </Button>
      </div>
      <div className="text-center mt-4 animate-fadeIn" style={{ animationDelay: '500ms' }}>
        <Button onClick={() => setView('login')} variant="link" className="w-auto">
          ← Back to login
        </Button>
      </div>
    </div>
  );

  // ============================================
  // MAIN RENDER
  // ============================================
  const titles = {
    login: { title: 'Welcome to Our Platform', subtitle: 'Login with your phone number' },
    otp: { title: 'Welcome to Our Platform', subtitle: 'Enter verification code' },
    register: { title: 'Welcome to Our Platform', subtitle: 'Create your account' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl animate-scaleIn">
        <div className="bg-indigo-600 p-6 text-center animate-slideInFromTop">
          <h1 className="text-2xl font-bold text-white transition-all duration-300 hover:scale-105">
            {titles[view].title}
          </h1>
          <p className="text-indigo-200 mt-2 animate-fadeIn" style={{ animationDelay: '200ms' }}>
            {titles[view].subtitle}
          </p>
        </div>
        
        <div className="p-6 animate-slideInFromBottom" style={{ animationDelay: '100ms' }}>
          {view === 'login' && renderLogin()}
          {view === 'otp' && renderOTP()}
          {view === 'register' && renderRegister()}
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200 animate-slideInFromTop transform transition-all duration-300 hover:shadow-md">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="animate-pulse">{error}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 px-6 py-4 text-center text-xs text-gray-500 animate-fadeIn" style={{ animationDelay: '400ms' }}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
};

export default LoginPage;