import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { FaFileAlt, FaSearch, FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";
import { Trash2 } from "lucide-react"; 
import {Search} from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector, useDispatch } from "react-redux";
import { selectUserDetails } from "../slices/userdetailsSlice";
import { setTitle } from "../slices/navbarSlice";
import BillPreview from "./BillPreview";
import ReactDOM from "react-dom";
import StaggeredContainer, { StaggeredItem } from './StaggeredContainer';

const GeneratedBills = () => {
  // Replace single date with date range (start and end dates)
// This allows filtering bills between two dates instead of just one specific date
  // changes
  // const [selectedDate, setSelectedDate] = useState(null);
  //changes made by Sagar
  const [dateRange, setDateRange] = useState({
  startDate: null,
  endDate: null
});

  // Handle start date change with validation
  const handleStartDateChange = (date) => {
    setDateRange(prev => {
      // If there's an end date and the new start date is after it, clear the end date
      if (prev.endDate && date && date > prev.endDate) {
        return { startDate: date, endDate: null };
      }
      return { ...prev, startDate: date };
    });
  };

  // Handle end date change with validation
  const handleEndDateChange = (date) => {
    setDateRange(prev => ({ ...prev, endDate: date }));
  };

  // Custom input component for date picker with formatting
  const CustomDateInput = React.forwardRef(({ value, onClick, onChange, placeholder, disabled }, ref) => {
    const [inputValue, setInputValue] = React.useState('');

    React.useEffect(() => {
      if (value) {
        setInputValue(value);
      } else {
        setInputValue('');
      }
    }, [value]);

    const handleInputChange = (e) => {
      let input = e.target.value.replace(/\D/g, ''); // Remove non-digits
      let formatted = '';
      
      if (input.length > 0) {
        // Day formatting: auto-add leading zero if single digit
        let day = input.slice(0, 2);
        if (input.length === 1 && parseInt(input) > 3) {
          day = '0' + input;
          input = day + input.slice(1);
        }
        formatted = day;
        
        // Auto-add "/" after day
        if (input.length >= 2) {
          formatted = input.slice(0, 2) + '/';
          
          // Month formatting
          if (input.length > 2) {
            let month = input.slice(2, 4);
            if (input.length === 3 && parseInt(input[2]) > 1) {
              month = '0' + input[2];
              input = input.slice(0, 2) + month + input.slice(3);
            }
            formatted += month;
            
            // Auto-add "/" after month
            if (input.length >= 4) {
              formatted += '/';
              
              // Year
              if (input.length > 4) {
                formatted += input.slice(4, 8);
              }
            }
          }
        }
      }
      
      setInputValue(formatted);
      
      // Parse and validate the complete date
      if (formatted.length === 10) {
        const [day, month, year] = formatted.split('/');
        const date = new Date(year, month - 1, day);
        
        // Check if it's a valid date
        if (date.getDate() == day && date.getMonth() == month - 1 && date.getFullYear() == year) {
          // Trigger the DatePicker's onChange
          if (onChange) {
            const syntheticEvent = {
              target: { value: formatted }
            };
            onChange(date);
          }
        }
      } else if (formatted.length === 0 && onChange) {
        // Clear the date if input is empty
        onChange(null);
      }
    };

    return (
      <input
        ref={ref}
        value={inputValue}
        onClick={onClick}
        placeholder={placeholder}
        disabled={disabled}
        readOnly
        className="w-full border border-[#4154f1] rounded-lg p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4154f1] disabled:bg-gray-100 disabled:cursor-not-allowed dark:disabled:bg-gray-700 cursor-pointer"
        maxLength={10}
      />
    );
  });

  // ADDITION: Add state for delete confirmation modal - Made by Sagar
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [billToDelete, setBillToDelete] = useState(null);

  const [bills, setBills] = useState([]);
  const [preview,setPreview] = useState(false);
  const [billdata,setBilldata] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);  // Pagination state
  // Rows per page state (persisted in localStorage)
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    try {
      const raw = localStorage.getItem('gb_rows_per_page');
      if (!raw) return { value: 10, showAll: false, isOpen: false };
      return JSON.parse(raw);
    } catch (e) {
      return { value: 10, showAll: false, isOpen: false };
    }
  });

  // Derived itemsPerPage for calculations
  const itemsPerPage = rowsPerPage.showAll ? Infinity : rowsPerPage.value;
  const [searchTerm, setSearchTerm] = useState("");  // For Bill ID search

  const [totalBills, setTotalBills] = useState(0);           // For Total Bills Generated
  const [lastMonthBills, setLastMonthBills] = useState(0);    // For Bills Generated Last Month
  const [thisMonthBills, setThisMonthBills] = useState(0);    // For Bills Generated This Month

  const authToken = useSelector((state) => state.auth.authToken); // access from global auth state 

  const { rows } = useSelector((state) => state.products);
  const { gstDetails } = useSelector((state) => state.gst);
  const userDetails = useSelector(selectUserDetails);
  const { GSTtandcDetails } = useSelector((state) => state.tandc);
  const { businesses,selectedBusiness } = useSelector((state) => state.business);
  const { signature } = useSelector((state) => state.signature);
  const signatureEnabled = useSelector((state)=> state.signature.enabled);
  const { stamp } = useSelector((state) => state.stamp);
  const stampEnabled = useSelector((state)=> state.stamp.enabled);
  const {logo} = useSelector((state)=> state.logo);
  const {qr} = useSelector((state)=> state.qr);
  const { selectedGBank } = useSelector((state) => state.banks);
  const bankEnabled = useSelector((state)=> state.banks.enabled);
  const attestationSelection = useSelector((state) => state.toggle.enabled);

  const [business, setSelectedBusiness] = useState(
      () => businesses?.find((b) => b._id === selectedBusiness) || {}
    );

  const dispatch = useDispatch();



  useEffect(() => {
    const fetchBills = async () => {
      try {
        if (!authToken) {
          setErrorMessage("No token found");
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/myTransactions`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data.status) {
          const allBills = response.data.data;
          setBills(allBills);
          
          // Calculate total bills
          setTotalBills(allBills.length);

          // Calculate bills for this month and last month
          const currentMonth = new Date().getMonth() + 1; // Months are zero-indexed in JS Date object
          const currentYear = new Date().getFullYear();
          const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
          const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

          let billsThisMonth = 0;
          let billsLastMonth = 0;

          allBills.forEach((bill) => {
            const billDate = new Date(bill.created_at);
            const billMonth = billDate.getMonth() + 1;
            const billYear = billDate.getFullYear();

            if (billMonth === currentMonth && billYear === currentYear) {
              billsThisMonth++;
            }

            if (billMonth === lastMonth && billYear === lastMonthYear) {
              billsLastMonth++;
            }
          });

          setThisMonthBills(billsThisMonth);
          setLastMonthBills(billsLastMonth);

        } else {
          setErrorMessage("Failed to retrieve bills: " + response.data.message);
        }

      } catch (error) {
        setErrorMessage("Error fetching the bills: " + (error.response ? error.response.data.message : error.message));
      }
    };

    fetchBills();
  }, [authToken]);

  useEffect(()=>{
    const setNavTitle = () =>{
      dispatch(setTitle('Generated Bills'));
    }

    setNavTitle();
  },[setTitle,dispatch])

  // Persist rowsPerPage to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('gb_rows_per_page', JSON.stringify(rowsPerPage));
    } catch (e) {
      // ignore storage errors
    }
    // Reset to first page when rows per page changes
    setCurrentPage(1);
  }, [rowsPerPage]);


  // handle bill view 

  const handleBillView = () =>{

    const invoiceDataFromGlobal = {
      firstParty: {
        gstin: business ? business.gstin : '',
        legal_name: business ? business.legal_name: '',
        trade_name: business ? business.trade_name: '',
        principal_address: business ? business.principal_address: '',
        shipping_address: business ? business.shipping_address: ''
      },
      party: {
        gstin: gstDetails.gstin,
        legal_name: gstDetails.legalName,
        trade_name: gstDetails.tradeName,
        principal_address: gstDetails.billedTo,
        shipping_address: gstDetails.shippingAddress,
        invoiceDate: userDetails.invoiceDate,
        invoiceNo:userDetails.invoiceNo,
        phoneNo: userDetails.phoneNo,
      },
      quantities: rows.map((row) => row.quantity),
      hsn_details: rows.map((row) => ({
        hsn_code: row.hsn_code,
        product_info: row.product_info,
        cgst: row.cgst,
        sgst: row.sgst,
        unit: row.unit,
      })),
      rates: rows.map((row) => row.price),
      tandc: GSTtandcDetails,
      signature: signature,
      stamp: stamp,
      logo:logo,
      qr:qr,
      bank: selectedGBank,
      signatureEnabled:signatureEnabled,
      stampEnabled:stampEnabled,
      bankEnabled:bankEnabled,
      attestationSelection:attestationSelection
    };

  }

  // MODIFICATION: Update delete handling to use confirmation modal - Made by Sagar
  // This function now shows the confirmation modal instead of deleting immediately
  const confirmDelete = (bill) => {
    setBillToDelete(bill);
    setShowDeleteModal(true);
  };

  // The actual delete function now called after confirmation
  const handleDeleteBill = async (transactionId) =>{
    try {
      setShowDeleteModal(false); // Close the modal
      
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/user/transaction`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          data: {
            transaction_id: transactionId,
          },
        }
      );
  
      console.log("Response:", response.data);
      // Update local state instead of reloading the page
      if (response.data.status) {
        setBills(bills.filter(bill => bill._id !== transactionId));
        // Optional: Show success message
      }
    } catch (error) {
      console.error("Error deleting transaction:", error.response?.data || error.message);
    }
  }

  const handleViewBill = (bill)=>{
    setBilldata(bill);
    //console.log({abc : bill});
    setPreview(true);
  }

  // Calculate the displayed bills based on the current page
  const sortedBills = bills.sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  );

  const indexOfLastBill = rowsPerPage.showAll ? sortedBills.length : currentPage * itemsPerPage;
  const indexOfFirstBill = rowsPerPage.showAll ? 0 : indexOfLastBill - itemsPerPage;

  //Update the filtering logic to use date range instead of single date
// This checks if a bill's date falls within the selected start and end dates
  // const filteredBills = sortedBills.filter((bill) => {
  //   const isDateMatch = selectedDate
  //     ? new Date(bill.created_at).toLocaleDateString() === selectedDate.toLocaleDateString()
  //     : true;
  //   const isSearchMatch = bill.sn_no.toLowerCase().includes(searchTerm.toLowerCase());

  //   return isDateMatch && isSearchMatch;
  // });

  // With this: change by Sagar 
const filteredBills = sortedBills.filter((bill) => {
  const billDate = new Date(bill.created_at);
  billDate.setHours(0, 0, 0, 0); // Normalize to start of day for comparison
  
  // Date range check - only filter if BOTH dates are selected
  let isDateInRange = true;
  if (dateRange.startDate && dateRange.endDate) {
    const startDate = new Date(dateRange.startDate);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(dateRange.endDate);
    endDate.setHours(23, 59, 59, 999);
    
    isDateInRange = billDate >= startDate && billDate <= endDate;
  }
  
  // Search term check
  const isSearchMatch = bill.sn_no.toLowerCase().includes(searchTerm.toLowerCase());

  return isDateInRange && isSearchMatch;
});

  const currentBills = rowsPerPage.showAll ? filteredBills : filteredBills.slice(indexOfFirstBill, indexOfLastBill);

  // Handle page change
  const totalPages = rowsPerPage.showAll ? 1 : Math.ceil(filteredBills.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle rows per page selection
  const handleRowsPerPageChange = (value) => {
    if (value === 'all') {
      setRowsPerPage(prev => ({ ...prev, showAll: true, isOpen: false }));
    } else {
      setRowsPerPage(prev => ({ ...prev, value: parseInt(value, 10), showAll: false, isOpen: false }));
    }
  };

  // Portal-based dropdown component with proper animations and positioning
  const RowsPerPageDropdown = ({ rowsPerPage, setRowsPerPage, onChange }) => {
    const buttonRef = useRef(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0, showAbove: false });
    const options = [10, 20, 30, 50, 100];

    // Calculate position when dropdown opens
    useEffect(() => {
      if (rowsPerPage.isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const estimatedMenuHeight = 320; // Approximate height for 6 options
        
        // Determine if we should show above or below
        const spaceBelow = viewportHeight - rect.bottom;
        const showAbove = spaceBelow < estimatedMenuHeight && rect.top > estimatedMenuHeight;
        
        setMenuPosition({
          top: showAbove ? rect.top - 8 : rect.bottom + 8,
          left: rect.right - 160, // Align to right edge of button
          width: Math.max(rect.width, 160),
          showAbove
        });
      }
    }, [rowsPerPage.isOpen]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback((e) => {
      if (!rowsPerPage.isOpen) return;
      const currentIndex = options.indexOf(rowsPerPage.value);
      
      switch (e.key) {
        case 'Escape':
          setRowsPerPage(prev => ({ ...prev, isOpen: false }));
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (rowsPerPage.showAll) {
            onChange(options[0]);
          } else {
            const next = options[currentIndex + 1];
            if (next) onChange(next);
            else onChange('all');
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (rowsPerPage.showAll) {
            onChange(options[options.length - 1]);
          } else if (currentIndex > 0) {
            onChange(options[currentIndex - 1]);
          }
          break;
        case 'Home':
          onChange(options[0]);
          break;
        case 'End':
          onChange('all');
          break;
        default:
          break;
      }
    }, [rowsPerPage.isOpen, rowsPerPage.value, rowsPerPage.showAll, onChange, setRowsPerPage, options]);

    useEffect(() => {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Render portal dropdown
    const dropdownMenu = rowsPerPage.isOpen && ReactDOM.createPortal(
      <>
        {/* Backdrop with blur */}
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
          style={{ animation: 'fadeIn 0.15s ease-out' }}
          onClick={() => setRowsPerPage(prev => ({ ...prev, isOpen: false }))}
        />
        
        {/* Menu */}
        <div
          className="fixed z-[9999] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          style={{
            top: menuPosition.showAbove ? 'auto' : `${menuPosition.top}px`,
            bottom: menuPosition.showAbove ? `${window.innerHeight - menuPosition.top}px` : 'auto',
            left: `${menuPosition.left}px`,
            width: `${menuPosition.width}px`,
            transformOrigin: menuPosition.showAbove ? 'bottom center' : 'top center',
            animation: 'dropdownIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        >
          <div className="py-2 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            {options.map((v) => {
              const isActive = rowsPerPage.value === v && !rowsPerPage.showAll;
              return (
                <button
                  key={v}
                  onClick={() => onChange(v)}
                  className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-semibold'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span>{v} rows</span>
                  {isActive && (
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  )}
                </button>
              );
            })}
            <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
            <button
              onClick={() => onChange('all')}
              className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors ${
                rowsPerPage.showAll
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-semibold'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span>Show All</span>
              {rowsPerPage.showAll && (
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Animation styles */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes dropdownIn {
            0% {
              opacity: 0;
              transform: scale(0.95) translateY(-4px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          @keyframes bounce-subtle {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }
          .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
          }
          .scrollbar-thin::-webkit-scrollbar-track {
            background: transparent;
          }
          .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 3px;
          }
          .dark .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
            background: #4b5563;
          }
        `}</style>
      </>,
      document.body
    );

    return (
      <>
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setRowsPerPage(prev => ({ ...prev, isOpen: !prev.isOpen }))}
          className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
          aria-haspopup="listbox"
          aria-expanded={rowsPerPage.isOpen}
        >
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200 select-none">
            {rowsPerPage.showAll ? 'Show All' : `${rowsPerPage.value} rows`}
          </span>
          <svg 
            className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${rowsPerPage.isOpen ? 'rotate-180' : ''}`}
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd"/>
          </svg>
        </button>
        {dropdownMenu}
      </>
    );
  };

  return (
    <div className="p-8 min-h-screen dark:bg-gray-800">
    <div className="mt-3">
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <StaggeredContainer className="grid grid-cols-1 md:grid-cols-3 gap-16 px-4 py-2 mb-3">
        <StaggeredItem>
          <div className="bg-white shadow-xl border rounded-3xl p-6 w-full h-40 transform transition-all duration-300 hover:scale-105 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-5xl text-center text-gray-800 mt-2 dark:text-gray-200">{totalBills}</h2>
            <p className="text-center text-black text-[16px] font-medium mt-4 dark:text-gray-200">Total Bills Generated</p>
          </div>
        </StaggeredItem>
        <StaggeredItem>
          <div className="bg-white shadow-xl border rounded-3xl p-6 w-full h-40 transform transition-all duration-300 hover:scale-105 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-5xl text-center text-gray-800 mt-2 dark:text-gray-200">{lastMonthBills}</h2>
            <p className="text-center text-black text-[16px] font-medium mt-4 dark:text-gray-200">Bills Generated Last Month</p>
          </div>
        </StaggeredItem>
        <StaggeredItem>
          <div className="bg-white shadow-xl border rounded-3xl p-6 w-full h-40 transform transition-all duration-300 hover:scale-105 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-5xl text-center text-gray-800 mt-2 dark:text-gray-200">{thisMonthBills}</h2>
            <p className="text-center text-black text-[16px] font-medium mt-4 dark:text-gray-200">Bills Generated This Month</p>
          </div>
        </StaggeredItem>
      </StaggeredContainer>
      
       <div className="flex flex-col sm:flex-row justify-end items-center gap-3 p-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-auto">
          <div className="flex items-center w-full">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Bill ID"
              className="w-full border border-[#4154f1] rounded-lg p-2 pl-10 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
            />
          </div>
        </div>

        {/* Date Picker */}
        {/* // Replace single date picker with start and end date pickers 
// This provides UI for selecting both the start and end dates of the range
// Replace the single DatePicker section: */}
        {/* <div className="relative w-full sm:w-auto">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Filter by date"
            className="w-full border border-[#4154f1] rounded-lg p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        </div> */}

        {/* // With this date range picker: */}
<div className="flex items-center space-x-2 w-full sm:w-auto">
  <div className="relative w-full">
    <DatePicker
      selected={dateRange.startDate}
      onChange={handleStartDateChange}
      selectsStart
      startDate={dateRange.startDate}
      endDate={dateRange.endDate}
      maxDate={dateRange.endDate || new Date()}
      dateFormat="dd/MM/yyyy"
      placeholderText="DD/MM/YYYY"
      isClearable
      customInput={<CustomDateInput />}
    />
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
    </div>
  </div>
  
  <span className="text-gray-500 dark:text-gray-400">to</span>
  
  <div className="relative w-full group">
    <DatePicker
      selected={dateRange.endDate}
      onChange={handleEndDateChange}
      selectsEnd
      startDate={dateRange.startDate}
      endDate={dateRange.endDate}
      minDate={dateRange.startDate}
      maxDate={new Date()}
      dateFormat="dd/MM/yyyy"
      placeholderText="DD/MM/YYYY"
      isClearable
      disabled={!dateRange.startDate}
      customInput={<CustomDateInput />}
    />
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
    </div>
  </div>
</div>


        {/* Optional: Clear Filters Button */}
        <button 
          onClick={() => {
            setSearchTerm('');
            // setSelectedDate(null);Update the clear filters button to reset the date range instead of single date
            setDateRange({startDate: null, endDate: null}); //change by Sagar
          }}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          Clear Filters
        </button>
      </div>
      

  <div className="bg-white border rounded-xl shadow-xl border-gray-200 overflow-visible dark:bg-gray-800 dark:border-gray-700">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Generated Bills</h2>
          </div>
          
          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">Invoice No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">Bill For</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">Issue Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">E-way</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:bg-gray-800 dark:border-gray-700">
                {currentBills.map((bill) => (
                  <tr key={bill._id} className="hover:bg-gray-50 transition-colors dark:hover:bg-gray-600">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{bill.sn_no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">{bill.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">
                      {new Date(bill.created_at).toLocaleString([], { hour12: true, timeStyle: 'short', dateStyle: 'medium' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">₹ {bill.total_value ? bill.total_value.toLocaleString() : "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        bill.generated 
                          ? "bg-green-100 text-green-800 dark:bg-green-200" 
                          : "bg-red-100 text-red-800 dark:bg-red-200"
                      }`}>
                        {bill.generated ? "Generated" : "Not Generated"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        bill.eway_status === 'done' 
                          ? "bg-green-100 text-green-800 dark:bg-green-200" 
                          : "bg-red-100 text-red-800 dark:bg-red-200"
                      }`}>
                        {bill.eway_status === 'done' ? "Generated" : "Not Generated"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <button 
                          onClick={() => {handleViewBill(bill)}} 
                          className="text-blue-600 hover:text-blue-800 transition-colors dark:text-gray-200"
                          title="View Bill"
                        >
                         <FaEye className="w-5 h-5" />
                        </button>
                        {/* MODIFICATION: Changed direct delete to use confirmation - Made by Sagar */}
                        <button 
                          onClick={() => confirmDelete(bill)} 
                          className="text-red-600 hover:text-red-800 transition-colors dark:text-gray-200"
                          title="Delete Bill"
                        >
                         <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Empty State */}
          {currentBills.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p className="text-gray-600 text-lg">No bills found</p>
              <p className="text-gray-500 mt-1">Any generated bills will appear here</p>
            </div>
          )}
          
          {/* Pagination Controls - Improved UI */}
          {currentBills.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                  Previous
                </button>
                
                <div className="hidden md:flex mx-2">
                  {[...Array(totalPages)].map((_, index) => {
                    // Show limited page numbers with ellipsis for better UX
                    const pageNum = index + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={index}
                          onClick={() => handlePageClick(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                            currentPage === pageNum
                              ? "z-5 bg-blue-600 text-white border-blue-600 dark:bg-blue-800 dark:text-gray-200 dark:hover:bg-blue-700 dark:border-blue-800"
                              : "bg-white text-gray-700 hover:bg-gray-50"
                          } mx-1 rounded-md`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      (pageNum === 2 && currentPage > 3) ||
                      (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <span
                          key={index}
                          className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
                
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Next
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
              
             <div className="flex items-center gap-6">
               <RowsPerPageDropdown
               rowsPerPage={rowsPerPage}
               setRowsPerPage={setRowsPerPage}
               onChange={handleRowsPerPageChange}
               />
               <div className="text-sm text-gray-600 dark:text-gray-200 select-none">
                 {rowsPerPage.showAll ? (
                   `Showing all ${currentBills.length} bills`
                 ) : (
                   `Page ${currentPage} of ${totalPages} • Showing ${currentBills.length} of ${filteredBills.length} bills`
                 )}
               </div>
             </div>
            </div>
          )}
        </div>
      </div>

      <BillPreview
         open={preview} 
         onClose={() => setPreview(false)} 
         billData={billdata} 
      />

      {/* ADDITION: Delete Confirmation Modal - Made by Sagar */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity" 
              aria-hidden="true"
              onClick={() => setShowDeleteModal(false)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-80"></div>
            </div>

            {/* Modal panel */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div 
              className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog" 
              aria-modal="true" 
              aria-labelledby="modal-headline"
            >
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600 dark:text-red-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" id="modal-headline">
                      Delete Invoice
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        Are you sure you want to delete invoice <span className="font-semibold text-gray-700 dark:text-gray-200">{billToDelete?.sn_no}</span>? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => handleDeleteBill(billToDelete?._id)}
                >
                  Delete
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 text-base font-medium text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default GeneratedBills;