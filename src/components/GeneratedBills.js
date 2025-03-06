import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFileAlt, FaSearch, FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";
import { Trash2 } from "lucide-react"; 
import {Search} from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector, useDispatch } from "react-redux";
import { selectUserDetails } from "../slices/userdetailsSlice";
import { setTitle } from "../slices/navbarSlice";

const GeneratedBills = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [bills, setBills] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);  // Pagination state
  const itemsPerPage = 10;  // Show 10 entries per page
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
        principal_address: gstDetails.principalAddress,
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

  const handleDeleteBill = async (transactionId) =>{

    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/user/transaction`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Replace with your actual token
          },
          data: {
            transaction_id: transactionId,
          },
        }
      );
  
      console.log("Response:", response.data);
      window.location.reload(); 
    } catch (error) {
      console.error("Error deleting transaction:", error.response?.data || error.message);
    }
  }
  // Calculate the displayed bills based on the current page
  const indexOfLastBill = currentPage * itemsPerPage;
  const indexOfFirstBill = indexOfLastBill - itemsPerPage;

  // Filter bills by search term and selected date
  const filteredBills = bills.filter((bill) => {
    const isDateMatch = selectedDate
      ? new Date(bill.created_at).toLocaleDateString() === selectedDate.toLocaleDateString()
      : true;
    const isSearchMatch = bill.sn_no.toLowerCase().includes(searchTerm.toLowerCase());

    return isDateMatch && isSearchMatch;
  });

  const currentBills = filteredBills.slice(indexOfFirstBill, indexOfLastBill);

  // Handle page change
  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);

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

  return (
    <div className="p-8 mt-10">
    <div className="mt-3">
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 px-4 py-2 mb-3">
        <div className="bg-white shadow-xl border rounded-3xl p-6 w-full h-40 transform transition-all duration-300 hover:scale-105">
          <h2 className="text-5xl text-center text-gray-800 mt-2">{totalBills}</h2>
          <p className="text-center text-black text-[16px] font-medium mt-4">Total Bills Generated</p>
        </div>
        <div className="bg-white shadow-xl border rounded-3xl p-6 w-full h-40 transform transition-all duration-300 hover:scale-105">
          <h2 className="text-5xl text-center text-gray-800 mt-2">{lastMonthBills}</h2>
          <p className="text-center text-black text-[16px] font-medium mt-4">Bills Generated Last Month</p>
        </div>
        <div className="bg-white shadow-xl border rounded-3xl p-6 w-full h-40 transform transition-all duration-300 hover:scale-105">
          <h2 className="text-5xl text-center text-gray-800 mt-2">{thisMonthBills}</h2>
          <p className="text-center text-black text-[16px] font-medium mt-4">Bills Generated This Month</p>
        </div>
      </div>
      
       <div className="flex flex-col sm:flex-row justify-end items-center gap-3 p-4 bg-white border-b border-gray-200">
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
              className="w-full border border-[#4154f1] rounded-lg p-2 pl-10"
            />
          </div>
        </div>

        {/* Date Picker */}
        <div className="relative w-full sm:w-auto">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Filter by date"
            className="w-full border border-[#4154f1] rounded-lg p-2"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        </div>

        {/* Optional: Clear Filters Button */}
        <button 
          onClick={() => {
            setSearchTerm('');
            setSelectedDate(null);
          }}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          Clear Filters
        </button>
      </div>
      

      <div className="bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Generated Bills</h2>
          </div>
          
          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill For</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-way</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentBills.map((bill) => (
                  <tr key={bill._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bill.sn_no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bill.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(bill.created_at).toLocaleString([], { hour12: true, timeStyle: 'short', dateStyle: 'medium' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹ {bill.total_value ? bill.total_value.toLocaleString() : "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        bill.generated 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {bill.generated ? "Generated" : "Not Generated"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        bill.eway_status === 'done' 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {bill.eway_status === 'done' ? "Generated" : "Not Generated"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <a 
                          href={bill.downloadlink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="View Bill"
                        >
                          <FaEye className="w-5 h-5" />
                        </a>
                        <button 
                          onClick={() => handleDeleteBill(bill._id)} 
                          className="text-red-600 hover:text-red-800 transition-colors"
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
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
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
                              ? "z-10 bg-blue-600 text-white border-blue-600"
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
                          className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700"
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
              
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages} • Showing {currentBills.length} bills
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratedBills;
