import React,{useState} from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt, FaBusinessTime, FaFileInvoice, FaFileAlt,
  FaMoneyBillWave, FaChartLine, FaUsers, FaEnvelope, FaQuestionCircle,
  FaCog, FaSignOutAlt,FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import {useSelector} from 'react-redux';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {businesses} = useSelector((state)=> state.business);

  const handleDropdown = () =>{
      if(businesses.length === 0){
         alert('Add a Business to generate the Bill');
         return;
      }
      setIsOpen(!isOpen);
  }

  return (
    <div className="bg-[#F9FAFC] w-64 h-screen flex flex-col px-6 py-4 shadow-lg">
      <div>
        <div>
          <h1 className="text-[#4154f1] font-bold text-3xl">SCAN T</h1>
          <p className="text-black font-medium mb-8">Billing Software</p>
        </div>
        <div>
          <p className="text-black uppercase font-medium text-xs mb-4">Main Menu</p>
          <ul>
            <li className="mb-4 flex items-center">
              <FaTachometerAlt className="text-[#4154f1] mr-4" />
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? 'text-[#4154f1] font-semibold' : 'text-black font-medium'}
              >
                Dashboard
              </NavLink>
            </li>
            {/*<li className="mb-4 flex items-center">
              <FaBusinessTime className="text-[#4154f1] mr-4" />
              <NavLink
                to="/add-business"
                className={({ isActive }) =>
                  isActive ? 'text-[#4154f1] font-semibold' : 'text-black font-medium'}
              >
                Add Business
              </NavLink>
            </li>*/}
            <li className="mb-4 flex items-center">
              <FaFileAlt className="text-[#4154f1] mr-4" />
              <NavLink
                to="/my-business"
                className={({ isActive }) =>
                  isActive ? 'text-[#4154f1] font-semibold' : 'text-black font-medium'}
              >
                My Business
              </NavLink>
            </li>
            {/*<li className="mb-4 flex items-center">
              <FaFileInvoice className="text-[#4154f1] mr-4" />
              <NavLink
                to="/generate-bill"
                className={({ isActive }) =>
                  isActive ? 'text-[#4154f1] font-semibold' : 'text-black font-medium'}
              >
                Generate New Bill
              </NavLink>
            </li>*/}
             <li className="mb-4">
                  <div 
                  className="flex items-center justify-between cursor-pointer" 
                  onClick={() => handleDropdown()}
                  >
                  <div className="flex items-center">
                    <FaFileInvoice className="text-[#4154f1] mr-4" />
                    <span className="text-black font-medium">Generate New Bill</span>
                  </div>
                  {/* Arrow Icon Toggle */}
                  {isOpen ? (
                    <FaChevronUp className="text-gray-600 ml-2 transition-transform duration-300" />
                  ) : (
                    <FaChevronDown className="text-gray-600 ml-2 transition-transform duration-300" />
                  )}
                </div>

                {/* Dropdown Links */}
                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-40" : "max-h-0"}`}>
                  <ul className="mt-2 ml-8 space-y-2">
                    <li>
                      <NavLink
                        to="/gst-invoice"
                        className={({ isActive }) =>
                          isActive ? "text-[#4154f1] font-semibold" : "text-black font-medium"
                        }
                      >
                        GST Invoice
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/invoice"
                        className={({ isActive }) =>
                          isActive ? "text-[#4154f1] font-semibold" : "text-black font-medium"
                        }
                      >
                        Invoice
                      </NavLink>
                    </li>
                  </ul>
                </div>
            </li>
            <li className="mb-4 flex items-center">
              <FaFileAlt className="text-[#4154f1] mr-4" />
              <NavLink
                to="/generated-bills"
                className={({ isActive }) =>
                  isActive ? 'text-[#4154f1] font-semibold' : 'text-black font-medium'}
              >
                Transactions
              </NavLink>
            </li>
            <li className="mb-4 flex items-center">
              <FaFileInvoice className="text-[#4154f1] mr-4" />
              <NavLink
                to="/inventory"
                className={({ isActive }) =>
                  isActive ? 'text-[#4154f1] font-semibold' : 'text-black font-medium'}
              >
                Inventory
              </NavLink>
            </li>
            <li className="mb-4 flex items-center">
              <FaFileAlt className="text-[#4154f1] mr-4" />
              <NavLink
                to="/eway-bills"
                className={({ isActive }) =>
                  isActive ? 'text-[#4154f1] font-semibold' : 'text-black font-medium'}
              >
                Generate E-way Bill
              </NavLink>
            </li>
            <li className="mb-4 flex items-center">
              <FaUsers className="text-[#4154f1] mr-4" />
              <NavLink
                to="/users"
                className={({ isActive }) =>
                  isActive ? 'text-[#4154f1] font-semibold' : 'text-black font-medium'}
              >
                Parties
              </NavLink>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-black uppercase font-medium text-xs mb-4">Support</p>
          <ul>
            <li className="mb-4 flex items-center">
              <FaEnvelope className="text-[#4154f1] mr-4" />
              <NavLink
                to="/messages"
                className={({ isActive }) =>
                  isActive ? 'text-[#4154f1] font-semibold' : 'text-black font-medium'}
              >
                Messages
              </NavLink>
            </li>
            <li className="mb-4 flex items-center ">
              <FaQuestionCircle className="text-[#4154f1] mr-4" />
              <NavLink to="/help" className={({ isActive }) => isActive ? 'text-[#4154f1] font-semibold' : 'text-black font-medium'} > Help </NavLink>
            </li>
          </ul>
        </div>
      </div>
      <div className="mb-4">
        <ul>
          <li className="mb-4 flex items-center">
            <FaCog className="text-[#4154f1] mr-4" />
            <NavLink to="/settings" className={({ isActive }) => isActive ? 'text-[#4154f1] font-semibold' : 'text-black font-medium'}>
              Settings
            </NavLink>
          </li>
          <li className="flex items-center">
            <FaSignOutAlt className="text-[#4154f1] mr-4" />
            <NavLink
              to="/logout"
              className={({ isActive }) =>
                isActive ? 'text-[#4154f1] font-semibold' : 'text-black font-medium'}
            >
              Log Out
            </NavLink>
          </li>
        </ul>
      </div>
      <p className="text-gray-400 text-xs">Version 1.0.0</p>
    </div>
  );
};

export default Sidebar;
