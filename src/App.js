import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./utility/ProtectedRoute";
import Sidebar from "./components/sidebar";
import Dashboard from "./components/Dashboard";
import AddBusiness from "./components/AddBusiness";
import YourBusiness from "./components/YourBusiness";
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
import Signup from "./components/Signup";
import Login from "./components/Login";
import Inventory from "./components/Inventory";

function App() {
  const location = useLocation();
  const isAuthPage = ["/signup", "/login"].includes(location.pathname);

  return (
    <div className="flex">

      {!isAuthPage && <Sidebar />} {/* Sidebar only appears on protected pages */}

      <div className="flex-grow">

        <Routes>

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-business"
            element={
              <ProtectedRoute>
                <AddBusiness />
              </ProtectedRoute>
            }
          />
          <Route path="/your-business"
            element={
              <ProtectedRoute>
                <YourBusiness />
              </ProtectedRoute>
            }
          />
          <Route
            path="/generate-bill"
            element={
              <ProtectedRoute>
                <GenerateBill />
              </ProtectedRoute>
            }
          />
          <Route
            path="/generated-bills"
            element={
              <ProtectedRoute>
                <GeneratedBills />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gst-invoice"
            element={
              <ProtectedRoute>
                <Inventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/eway-bills"
            element={
              <ProtectedRoute>
                <EwayBills />
              </ProtectedRoute>
            }
          />
          <Route
            path="/EWayBillRequest"
            element={
              <ProtectedRoute>
                <EWayBillRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <Payments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity"
            element={
              <ProtectedRoute>
                <Activity />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/helps"
            element={
              <ProtectedRoute>
                <Helps />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logout"
            element={
              <ProtectedRoute>
                <Logout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trans"
            element={
              <ProtectedRoute>
                <GeneratedBills />
              </ProtectedRoute>
            }
          />

          {/* Redirect to Login if no valid route */}
          <Route path="/*" element={<Login />} />

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
