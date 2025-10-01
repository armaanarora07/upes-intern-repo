import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {FaBusinessTime, FaFileInvoice,FaChartLine, FaUsers, FaEnvelope, FaQuestionCircle,
  FaCog, FaSignOutAlt, FaChevronDown, FaChevronUp,FaAngleRight, FaAngleLeft,FaTruck, FaBoxOpen, FaBook, FaUserTie
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import FyntlLogo1 from '../assets/FyntlLogo1.png';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});
  const [hoveredItem, setHoveredItem] = useState(null);
  const { businesses } = useSelector((state) => state.business);
  const dropdownRefs = useRef({});

  // Set CSS variable for sidebar width that can be used across the app
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--sidebar-width', 
      expanded ? '16rem' : '5rem'
    );
  }, [expanded]);

  const toggleDropdown = (key) => {

    if(businesses.length === 0){
      alert('Add a Business to generate the Bill');
      return;
    }
    
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleMouseEnter = (key) => {
    if (!expanded) {
      setHoveredItem(key);
    }
  };

  const handleMouseLeave = (key) => {
   
   setTimeout(()=>{
    if(!dropdownRefs.current[key]){
      setHoveredItem(null);
    }
   },1000);   
   
  };

  const handleDropdownMouseEnter = (key) => {
    setHoveredItem(key);
  };

  const handleDropdownMouseLeave = () => {
    setHoveredItem(null);
  };

  const toggleSidebar = () => {
    setExpanded(!expanded);
    // Close all dropdowns when collapsing sidebar
    if (expanded) {
      setExpandedItems({});
      setHoveredItem(null);
    }
  };

  // Define navigation items for reuse
  const navItems = [
    { icon: <FaChartLine />, label: 'Dashboard', path: '/dashboard' },
    { 
      icon: <FaFileInvoice />, 
      label: 'Generate New Bill', 
      path: '/generate-bill',
      hasDropdown: true,
      dropdownItems: [
        { label: 'GST Invoice', path: '/gst-invoice' },
        { label: 'URD Invoice', path: '/urd-invoice' },
      ]
    },
    { icon: <FaBusinessTime />, label: 'My Business', path: '/my-business' },
    { icon: <FaBook />, label: 'Transactions', path: '/generated-bills' },
    { icon: <FaBoxOpen />, label: 'Inventory', path: '/inventory' },
    { icon: <FaTruck />, label: 'E-way Bill', path: '/eway-bills' },
    { icon: <FaUsers />, label: 'Parties', path: '/users' },
    { icon: <FaUserTie />, label: 'Invite User', path: '/invite-user' },
    //{ icon: <FaEnvelope />, label: 'Messages', path: '/messages' },
    { icon: <FaQuestionCircle />, label: 'Help', path: '/help' },
    { icon: <FaCog />, label: 'Settings', path: '/settings' },
    { icon: <FaSignOutAlt />, label: 'Log Out', path: '/logout' }
  ];

  return (
    <div 
      className={`bg-[#1E1E2D] dark:bg-gray-900 h-screen flex flex-col shadow-lg relative ${
        expanded ? 'w-64' : 'w-20'
      }`}
    >
      {/* Toggle button - increased size */}
      <button 
        className="absolute -right-4 top-18 mt-4 bg-white rounded-lg p-2 shadow-md z-10 hover:bg-gray-50 dark:bg-gray-400 dark:text-gray-200 dark:hover:bg-gray-600 dark:border-gray-700"
        onClick={toggleSidebar}
      >
        {expanded ? 
          <FaAngleLeft className="text-[#1E1E2D] text-lg" /> : 
          <FaAngleRight className="text-[#1E1E2D] text-lg" />
        }
      </button>

      {/* Logo section */}
      <div className={`px-6 py-4 flex ${expanded ? 'justify-start' : 'justify-center'}`}>
        <div className="flex flex-col items-center">
          {expanded ? (
             <div className="flex items-center">
                <img alt='logo' src={FyntlLogo1} className='h-12 mr-3'/>
                <div>
                  <h1 className="text-lg font-bold text-white">Fyntl - AI</h1>
                  <p className="text-sm text-gray-400">Billing Software</p>
                </div>
             </div>
          ) : (
            <div>
                <img alt='logo' src={FyntlLogo1} className='h-auto w-auto mb-2'/>
             </div>
          )}
        </div>
      </div>

      {/* Navigation items */}
      <div className="flex-1 overflow-y">
        <ul className="px-2">
          {navItems.map((item, index) => (
            <li 
              key={item.path || index} 
              className="mb-1 relative"
              onMouseEnter={() => handleMouseEnter(item.label)}
              onMouseLeave={() => handleMouseLeave(item.label)}
            >
              <div>
                {item.hasDropdown ? (
                  <div 
                    className={`flex items-center ${expanded ? 'px-4 py-2.5 justify-between' : 'px-0 py-3 flex-col justify-center'} 
                    text-white font-medium cursor-pointer hover:bg-gray-700 rounded-md`}
                    onClick={() => toggleDropdown(item.label)}
                  >
                    <div className={`flex items-center ${!expanded && 'justify-center w-full'}`}>
                      <div className={`text-gray-300 ${expanded ? 'mr-3' : ''} text-2xl`}>
                        {item.icon}
                      </div>
                      {expanded && <span>{item.label}</span>}
                    </div>
                    {expanded && (
                      expandedItems[item.label] ? 
                        <FaChevronUp className="text-gray-400" /> : 
                        <FaChevronDown className="text-gray-400" />
                    )}
                  </div>
                ) : (
                  <SidebarLink item={item} expanded={expanded} />
                )}

                {/* Dropdown items - shown when expanded */}
                {expanded && item.hasDropdown && expandedItems[item.label] && (
                  <div className="overflow-hidden bg-gray-800 rounded-md mt-1 shadow-inner">
                    <ul className="py-1">
                      {item.dropdownItems.map((dropdownItem) => (
                        <li key={dropdownItem.path}>
                          <NavLink
                            to={dropdownItem.path}
                            className={({ isActive }) =>
                              `block pl-11 pr-4 py-2 ${
                                isActive ? 'text-white font-semibold' : 'text-gray-300 font-medium'
                              } hover:bg-gray-700`
                            }
                          >
                            {dropdownItem.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Focus Group for dropdown items when sidebar is collapsed - show on hover */}
                {!expanded && item.hasDropdown && hoveredItem === item.label && (
                  <div 
                    ref={el => dropdownRefs.current[item.label] = el}
                    className="absolute left-20 top-0 bg-white shadow-lg rounded-md z-50 w-60"
                    onMouseEnter={() => handleDropdownMouseEnter(item.label)}
                    onMouseLeave={handleDropdownMouseLeave}
                  >
                    <ul role="menu" className="py-2">
                      {item.dropdownItems?.map((dropdownItem, idx) => (
                        <li key={dropdownItem.path} role="menuitem">
                          <NavLink
                            to={dropdownItem.path}
                            className={({ isActive }) =>
                              `block px-4 py-3 ${
                                isActive 
                                  ? "bg-gray-200 text-gray-700 font-semibold" 
                                  : idx % 2 === 0 
                                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200" 
                                    : "bg-white text-gray-700 hover:bg-gray-200"
                              }`
                            }
                          >
                            {dropdownItem.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                 {/* Icon Indicator when sidebar is collapsed - show on hover */}
                 {!expanded && !item.hasDropdown && hoveredItem === item.label && (
                  <div
                    ref={(el) => (dropdownRefs.current[item.label] = el)}
                    className="absolute left-20 top-0 w-40 bg-gray-400 text-white shadow-md rounded-md p-2 z-50 text-center"
                    onMouseEnter={() => handleDropdownMouseEnter(item.label)}
                    onMouseLeave={handleDropdownMouseLeave}
                  >
                    {item.label}
                  </div>
                )}

              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Version info - only in expanded mode */}
      {expanded && (
        <div className="px-6 py-3">
          <p className="text-gray-500 text-xs">Version 1.0.0</p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

// Small helper component to render a collapsed-state active indicator
const SidebarLink = ({ item, expanded }) => {
  const location = useLocation();
  const isActive = location.pathname === item.path;
  const base = `flex items-center ${expanded ? 'px-4 py-2.5' : 'px-0 py-3 flex-col justify-center'} rounded-md`;
  const activeClass = isActive ? (expanded ? 'bg-white/10 text-white font-semibold border-l-4 border-blue-400' : '') : 'text-gray-300 font-medium hover:bg-gray-700';

  return (
    <NavLink to={item.path} className={`${base} ${activeClass}`}>
      <div className={`relative flex items-center ${expanded ? 'mr-3' : ''} text-2xl`}>
        {item.icon}
        {!expanded && isActive && (
          <span className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-blue-400" />
        )}
      </div>
      {expanded && <span>{item.label}</span>}
    </NavLink>
  );
};