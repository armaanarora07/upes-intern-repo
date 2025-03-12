import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./utility/ProtectedRoute";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./Home";  
import InviteRegister from "./pages/InviteRegister";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/invite-register' element={<InviteRegister/>}/>
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<Home />} />  
          {/* Home contains all protected pages like Dashboard, Inventory, etc. */}
        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;
