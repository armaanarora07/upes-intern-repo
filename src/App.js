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
import EWayBillRequest from './components/EWayBillRequest';

import Payments from './components/Payments';
import Activity from './components/Activity';
import Users from './components/Users';
import Messages from './components/Messages';
import Helps from './components/Helps';
import Settings from './components/Settings';
import Logout from './components/Logout';
import Signup from './components/Signup';
import Login from './components/Login';
import Inventory from './components/Inventory';
function App() {
  const location = useLocation();
  const isSignupPage = location.pathname === '/signup' || location.pathname === '/login';
  return (
    <div className="flex">
      {!isSignupPage && <Sidebar />} 
      

        <div className="flex-grow">
        
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-business" element={<AddBusiness />} />
            <Route path="/your-business" element={<YourBusiness />} />
            <Route path="/generate-bill" element={<GenerateBill />} />
            <Route path="/generated-bills" element={<GeneratedBills />} />
            <Route path="/gst-invoice" element={<Inventory/>} />
            <Route path="/eway-bills" element={<EwayBills />} />
            <Route path="/EWayBillRequest" element={<EWayBillRequest/>} />

            <Route path="/payments" element={<Payments />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/users" element={<Users />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/helps" element={<Helps />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/trans" element={<GeneratedBills/>} />


          </Routes>
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
