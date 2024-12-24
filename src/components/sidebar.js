import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt, FaBusinessTime, FaFileInvoice, FaFileAlt,
  FaMoneyBillWave, FaChartLine, FaUsers, FaEnvelope, FaQuestionCircle,
  FaCog, FaSignOutAlt
} from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="bg-[#F9FAFC] w-64 flex flex-col justify-between px-6 py-4 shadow-lg">
      <div>
        <div>
          <h1 className="text-blue-600 text-2xl font-bold mb-2">SCAN T</h1>
          <p className="text-gray-500 text-sm mb-8">Billing Software</p>
        </div>
        <div>
          <p className="text-gray-400 uppercase font-semibold text-xs mb-4">Main Menu</p>
          <ul>
            <li className="mb-4 flex items-center">
              <FaTachometerAlt className="text-gray-500 mr-4" />
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}
              >
                Dashboard
              </NavLink>
            </li>
            <li className="mb-4 flex items-center">
              <FaBusinessTime className="text-gray-500 mr-4" />
              <NavLink
                to="/add-business"
                className={({ isActive }) =>
                  isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}
              >
                Add Business
              </NavLink>
            </li>
            <li className="mb-4 flex items-center">
              <FaFileAlt className="text-gray-500 mr-4" />
              <NavLink
                to="/your-business"
                className={({ isActive }) =>
                  isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}
              >
                Your Business
              </NavLink>
            </li>
            <li className="mb-4 flex items-center">
              <FaFileInvoice className="text-gray-500 mr-4" />
              <NavLink
                to="/generate-bill"
                className={({ isActive }) =>
                  isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}
              >
                Generate New Bill
              </NavLink>
            </li>
            <li className="mb-4 flex items-center">
              <FaFileAlt className="text-gray-500 mr-4" />
              <NavLink
                to="/generated-bills"
                className={({ isActive }) =>
                  isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}
              >
                Generated Bills
              </NavLink>
            </li>
            <li className="mb-4 flex items-center">
              <FaFileInvoice className="text-gray-500 mr-4" />
              <NavLink
                to="/gst-invoice"
                className={({ isActive }) =>
                  isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}
              >
                GST Invoice
              </NavLink>
            </li>
            <li className="mb-4 flex items-center">
              <FaFileAlt className="text-gray-500 mr-4" />
              <NavLink
                to="/eway-bills"
                className={({ isActive }) =>
                  isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}
              >
                E-way Bills
              </NavLink>
            </li>
            <li className="mb-4 flex items-center">
              <FaMoneyBillWave className="text-gray-500 mr-4" />
              <NavLink
                to="/payments"
                className={({ isActive }) =>
                  isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}
              >
                Payments
              </NavLink>
            </li>
            <li className="mb-4 flex items-center">
              <FaChartLine className="text-gray-500 mr-4" />
              <NavLink
                to="/activity"
                className={({ isActive }) =>
                  isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}
              >
                Activity
              </NavLink>
            </li>
            <li className="mb-4 flex items-center">
              <FaUsers className="text-gray-500 mr-4" />
              <NavLink
                to="/users"
                className={({ isActive }) =>
                  isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}
              >
                Users
              </NavLink>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-gray-400 uppercase font-semibold text-xs mb-4">Support</p>
          <ul>
            <li className="mb-4 flex items-center">
              <FaEnvelope className="text-gray-500 mr-4" />
              <NavLink
                to="/messages"
                className={({ isActive }) =>
                  isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}
              >
                Messages
              </NavLink>
            </li>
            <li className="mb-4 flex items-center">
              <FaQuestionCircle className="text-gray-500 mr-4" />
              <NavLink
                to="/helps"
                className={({ isActive }) =>
                  isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}
              >
                Helps
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
      <div className="mb-4">
        <ul>
          <li className="mb-4 flex items-center">
            <FaCog className="text-gray-500 mr-4" />
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}
            >
              Settings
            </NavLink>
          </li>
          <li className="flex items-center">
            <FaSignOutAlt className="text-gray-500 mr-4" />
            <NavLink
              to="/logout"
              className={({ isActive }) =>
                isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}
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
