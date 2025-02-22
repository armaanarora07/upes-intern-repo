import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Dashboard from "./components/Dashboard";
import AddBusiness from "./components/AddBusiness";
import GenerateBill from "./components/GenerateNewBill";
import GeneratedBills from "./components/GeneratedBills";
import GstInvoice from "./components/GstInvoice";
import EwayBills from "./components/EwayBills";
import EWayBillRequest from "./components/EWayBillRequest";
import Payments from "./components/Payments";
import Activity from "./components/Activity";
import Users from "./components/Users";
import Messages from "./components/Messages";
import Helps from "./components/Helps";
import Settings from "./components/Settings";
import Logout from "./components/Logout";
import Inventory from "./components/Inventory";
import UrdInvoice from "./components/UrdInvoice";
import UpdateBusiness from "./components/UpdateBusiness";
import MyBusiness from "./components/MyBusiness";
import EWayTransactions from "./components/EwayTransactions";
import InvoicePage from "./components/GenerateInvoice";

function Home() {
  return (
    <div className="flex">
      <div className="fixed top-0 left-0 h-screen w-64 bg-[#F9FAFC] shadow-lg"> {/* Fixed Sidebar */}
        <Sidebar /> {/* Sidebar visible for all protected pages */}
      </div>
      <div className="flex-grow ml-64"> {/* Right pane with scroll */}
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-business" element={<AddBusiness />} />
          <Route path="/my-business" element={<MyBusiness />} />
          <Route path="/user-business" element={<UpdateBusiness />} />
          <Route path="/generate-bill" element={<GenerateBill />} />
          <Route path="/generated-bills" element={<GeneratedBills />} />
          <Route path="/gst-invoice" element={<GstInvoice />} />
          <Route path='/generate-invoice' element={<InvoicePage/>}/>
          <Route path="/invoice" element={<UrdInvoice />} />
          <Route path="/inventory" element={<Inventory/>}></Route>
          <Route path="/eway-bills" element={<EwayBills />} />
          <Route path="/EWayBillRequest" element={<EWayBillRequest />} />
          <Route path="/eway-transactions" element={<EWayTransactions/>}/>
          <Route path="/payments" element={<Payments />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/users" element={<Users />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/helps" element={<Helps />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/trans" element={<GeneratedBills />} />

          {/* Redirect unknown routes to Dashboard */}
          <Route path="/*" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default Home;
