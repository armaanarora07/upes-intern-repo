import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/sidebar';  
import Dashboard from './components/Dashboard';
import AddBusiness from './components/AddBusiness';
import YourBusiness from './components/YourBusiness';
import GenerateBill from './components/GenerateNewBill';
import GeneratedBills from './components/GeneratedBills';
import GstInvoice from './components/GstInvoice';
import EwayBills from './components/EwayBills';
import Payments from './components/Payments';
import Activity from './components/Activity';
import Users from './components/Users';
import Messages from './components/Messages';
import Helps from './components/Helps';
import Settings from './components/Settings';
import Logout from './components/Logout';
import Signup from './components/Signup';
import Login from './components/Login';
function App() {
  const location = useLocation();
  const isSignupPage = location.pathname === '/signup' || location.pathname === '/login';
  return (
    <div className="flex">
      {!isSignupPage && <Sidebar />} 
      <div className="flex-grow flex flex-col">
        {!isSignupPage && (
          <nav className="bg-[#F9FAFC] p-4 flex justify-between shadow-lg items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-[#F9FAFC] text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-3 top-3 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12a4 4 0 118 0 4 4 0 01-8 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2 12a10 10 0 1012 12 10 10 0 00-12-12z"
                />
              </svg>
            </div>
          </nav>
        )}
        <div className="flex-grow">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-business" element={<AddBusiness />} />
            <Route path="/your-business" element={<YourBusiness />} />
            <Route path="/generate-bill" element={<GenerateBill />} />
            <Route path="/generated-bills" element={<GeneratedBills />} />
            <Route path="/gst-invoice" element={<GstInvoice />} />
            <Route path="/eway-bills" element={<EwayBills />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/users" element={<Users />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/helps" element={<Helps />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

          </Routes>
        </div>
      </div>
    </div>
  );
}
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
