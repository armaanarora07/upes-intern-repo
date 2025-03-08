import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Dashboard from "./pages/Dashboard";
import AddBusiness from "./components/AddBusiness";
import GeneratedBills from "./components/GeneratedBills";
import EwayBills from "./components/EwayBills";
import EWayBillRequest from "./components/EWayBillRequest";
import Payments from "./components/Payments";
import Activity from "./components/Activity";
import Users from "./components/Users";
import Messages from "./components/Messages";
import Help from "./pages/Help";
import Settings from "./pages/Settings";
import Logout from "./components/Logout";
import Inventory from "./components/Inventory";
import URDInvoice from "./pages/URDInvoice";
import UpdateBusiness from "./components/UpdateBusiness";
import MyBusiness from "./components/MyBusiness";
import GSTInvoice from "./pages/GSTInvoice";
import Navbar from "./components/Navbar";
import EWayTransactions from './components/EwayTransactions';
import InvoicePage from './components/GenerateInvoice';
import UpdateEwayCred from "./components/UpdateEwayCred";

// Add this CSS to your global styles or create a specific CSS file
// .css or .scss file (to be included in your project)

/*
:root {
  --sidebar-width: 16rem; // Default expanded width 

*/

/*@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

*/

function Home() {
  return (
    <div className="flex">
      <div className="fixed top-0 left-0 h-screen bg-[#F9FAFC] shadow-lg z-20">
        <Sidebar />
      </div>
      {/* Use CSS variable for dynamic margin */}
      <div className="flex-grow" style={{ marginLeft: 'var(--sidebar-width, 16rem)' }}>
        <Navbar />
        <div className="mt-5 p-5">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-business" element={<AddBusiness />} />
            <Route path="/my-business" element={<MyBusiness />} />
            <Route path="/user-business" element={<UpdateBusiness />} />
            <Route path="/generated-bills" element={<GeneratedBills />} />
            <Route path="/gst-invoice" element={<GSTInvoice/>} />
            <Route path="/urd-invoice" element={<URDInvoice/>} />
            <Route path="/inventory" element={<Inventory/>}></Route>
            <Route path="/eway-bills" element={<EwayBills />} />
            <Route path="/EWayBillRequest" element={<EWayBillRequest />} />
            <Route path="/update-eway" element={<UpdateEwayCred/>} />
            <Route path="eway-transactions" element={<EWayTransactions/>}/>
            <Route path="/payments" element={<Payments />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/users" element={<Users />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/help" element={<Help/>} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/logout" element={<Logout />} />
            <Route path='/generate-invoice' element={<InvoicePage/>}/>
            {/* Redirect unknown routes to Dashboard */}
            <Route path="/*" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Home;