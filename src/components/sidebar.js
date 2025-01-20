import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt, FaBusinessTime, FaFileInvoice, FaFileAlt,
  FaMoneyBillWave, FaChartLine, FaUsers, FaEnvelope, FaQuestionCircle,
  FaCog, FaSignOutAlt
} from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="bg-[#F9FAFC] w-64 h-screen flex flex-col  px-6 py-4 shadow-lg">
      <div>
        <div>
          <h1 className="text-[#4154f1] text-2xl font-bold mb-2">SCAN T</h1>
          <p className="text-black text-sm mb-8">Billing Software</p>
        </div>
        <div>
          <p className="text-black uppercase font-semibold text-xs mb-4">Main Menu</p>
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
            <li className="mb-4 flex items-center">
              <FaBusinessTime className="text-[#4154f1] mr-4" />
              <NavLink
                to="/add-business"
                className={({ isActive }) =>
                  isActive ? 'text-[#4154f1] font-semibold' : 'text-black font-medium'}
              >
                Add Business
              </NavLink>
            </li>
            <li className="mb-4 flex items-center">
              <FaFileAlt className="text-[#4154f1] mr-4" />
              <NavLink
                to="/your-business"
                className={({ isActive }) =>
                  isActive ? 'text-[#4154f1] font-semibold' : 'text-black font-medium'}
              >
                Your Business
              </NavLink>
            </li>
            <li className="mb-4 flex items-center">
              <FaFileInvoice className="text-[#4154f1] mr-4" />
              <NavLink
                to="/generate-bill"
                className={({ isActive }) =>
                  isActive ? 'text-[#4154f1] font-semibold' : 'text-black font-medium'}
              >
                Generate New Bill
              </NavLink>
            </li>
            <li className="mb-4 flex items-center">
              <FaFileAlt className="text-[#4154f1] mr-4" />
              <NavLink
                to="/generated-bills"
                className={({ isActive }) =>
                  isActive ? 'text-[#4154f1] font-semibold' : 'text-black font-medium'}
              >
                Transcations
              </NavLink>
            </li>
            <li className="mb-4 flex items-center">
              <FaFileInvoice className="text-[#4154f1] mr-4" />
              <NavLink
                to="/gst-invoice"
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
                E-way Bills
              </NavLink>
            </li>
            {/* <li className="mb-4 flex items-center">
              <FaMoneyBillWave className="text-gray-500 mr-4" />
              <NavLink
                to="/payments"
                className={({ isActive }) =>
                  isActive ? 'text-[#4154f1] font-semibold' : 'text-gray-700'}
              >
                Payments
              </NavLink>
            </li> */}
            {/* <li className="mb-4 flex items-center">
              <FaChartLine className="text-gray-500 mr-4" />
              <NavLink
                to="/activity"
                className={({ isActive }) =>
                  isActive ? 'text-[#4154f1] font-semibold' : 'text-gray-700'}
              >
                Activity
              </NavLink>
            </li> */}
            {/* <li className="mb-4 flex items-center">
              <FaUsers className="text-gray-500 mr-4" />
              <NavLink
                to="/users"
                className={({ isActive }) =>
                  isActive ? 'text-[#4154f1] font-semibold' : 'text-gray-700'}
              >
                Users
              </NavLink>
            </li> */}
          </ul>
        </div>
        <div>
          <p className="text-black uppercase font-semibold text-xs mb-4">Support</p>
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
              <NavLink to="/helps" className={({ isActive }) =>   isActive ? 'text-[#4154f1] font-semibold' : 'text-black font-medium'}  >   Helps </NavLink>
            </li>
          </ul>
        </div>
      </div>
      <div className="mb-4">
        <ul>
          <li className="mb-4 flex items-center">
            <FaCog className="text-[#4154f1] mr-4" />
            <NavLink to="/settings" className={({ isActive }) =>  isActive ? 'text-[#4154f1] font-semibold' : 'text-black font-medium'}>
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

      <p className="text-gray-400 text-xs">version 1.0.0</p>
    </div>
  );
};

export default Sidebar;
