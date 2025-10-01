import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Dashboard from "./pages/Dashboard";
import AddBusiness from "./components/AddBusiness";
import GeneratedBills from "./components/GeneratedBills";
import EwayBills from "./components/EwayBills";
import EWayBillRequest from "./components/EWayBillRequest";
import Payments from "./components/Payments";
import Users from "./components/Users";
import Messages from "./components/Messages";
import Help from "./pages/Help";
import PageTransition from './components/PageTransition';
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
import InvitationsPage from "./pages/InvitationsPage";

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
        <div className="dark:bg-gray-800 mt-5 p-5">
          <Routes>
            <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
            <Route path="/add-business" element={<PageTransition><AddBusiness /></PageTransition>} />
            <Route path="/my-business" element={<PageTransition><MyBusiness /></PageTransition>} />
            <Route path="/user-business" element={<PageTransition><UpdateBusiness /></PageTransition>} />
            <Route path="/generated-bills" element={<PageTransition><GeneratedBills /></PageTransition>} />
            <Route path="/gst-invoice" element={<PageTransition><GSTInvoice/></PageTransition>} />
            <Route path="/urd-invoice" element={<PageTransition><URDInvoice/></PageTransition>} />
            <Route path="/inventory" element={<PageTransition><Inventory/></PageTransition>}></Route>
            <Route path="/eway-bills" element={<PageTransition><EwayBills /></PageTransition>} />
            <Route path="/EWayBillRequest" element={<PageTransition><EWayBillRequest /></PageTransition>} />
            <Route path="/update-eway" element={<PageTransition><UpdateEwayCred/></PageTransition>} />
            <Route path="eway-transactions" element={<PageTransition><EWayTransactions/></PageTransition>}/>
            <Route path="/payments" element={<PageTransition><Payments /></PageTransition>} />
            <Route path="/users" element={<PageTransition><Users /></PageTransition>} />
            <Route path="/messages" element={<PageTransition><Messages /></PageTransition>} />
            <Route path="/help" element={<PageTransition><Help/></PageTransition>} />
            <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
            <Route path="/logout" element={<PageTransition><Logout /></PageTransition>} />
            <Route path='/generate-invoice' element={<PageTransition><InvoicePage/></PageTransition>}/>
            <Route path='/invite-user' element={<PageTransition><InvitationsPage/></PageTransition>}/>
            {/* Redirect unknown routes to Dashboard */}
            <Route path="/*" element={<PageTransition><Dashboard /></PageTransition>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Home;