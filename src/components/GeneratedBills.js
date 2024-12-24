import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFileAlt, FaSearch, FaEdit, FaTrashAlt, FaEye } from "react-icons/fa"; 
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchBills = async () => {
      try {
        if (!token) {
          setErrorMessage("No token found");
          return;
        }

        const response = await axios.get('/user/myTransactions', {
          headers: {
            Authorization: `Bearer ${token}`,
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
  }, [token]);

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
    <div className="p-4">
      <div className="flex items-center space-x-2 h-14 bg-[#E7EDFF] border rounded-lg p-5 text-[#1436FF] font-bold text-3xl">
        <FaFileAlt className="text-3xl" />
        <span>Generated Bills</span>
      </div>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <div className="flex justify-end items-center space-x-4 p-4">
        <div className="flex items-center border rounded-md p-2 bg-white">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Bill ID"
            className="outline-none px-2 text-sm"
          />
          <FaSearch className="text-gray-500" />
        </div>
        <div className="relative">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select Date"
            className="border border-gray-300 rounded-md p-2 text-sm bg-white"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 px-4 py-6 ">
        <div className="bg-white shadow-xl rounded-3xl p-6 w-full h-40 transform transition-all duration-300 hover:scale-105">
          <h2 className="text-5xl text-center text-gray-800 mt-2">{totalBills}</h2>
          <p className="text-center text-gray-500 text-sm mt-4">Total Bills Generated</p>
        </div>
        <div className="bg-white shadow-xl rounded-3xl p-6 w-full h-40 transform transition-all duration-300 hover:scale-105">
          <h2 className="text-5xl text-center text-gray-800 mt-2">{lastMonthBills}</h2>
          <p className="text-center text-gray-500 text-sm mt-4">Bills Generated Last Month</p>
        </div>
        <div className="bg-white shadow-xl rounded-3xl p-6 w-full h-40 transform transition-all duration-300 hover:scale-105">
          <h2 className="text-5xl text-center text-gray-800 mt-2">{thisMonthBills}</h2>
          <p className="text-center text-gray-500 text-sm mt-4">Bills Generated This Month</p>
        </div>
      </div>

      <div className="p-4 overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Bill ID</th>
              <th className="px-4 py-2 text-left">Bill For</th>
              <th className="px-4 py-2 text-left">Issue Date</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentBills.map((bill) => (
              <tr key={bill._id}>
                <td className="border px-4 py-2">{bill.sn_no}</td>
                <td className="border px-4 py-2">{bill.name}</td>
                <td className="border px-4 py-2">{new Date(bill.created_at).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{bill.total_value || "N/A"}</td>
                <td className="border px-4 py-2">
                  <span className={`${bill.generated ? "text-green-500" : "text-red-500"}`}>
                    {bill.generated ? "Generated" : "Not Generated"}
                  </span>
                </td>
                <td className="border px-4 py-2">
                  <div className="flex space-x-2">
                    <a href={bill.downloadlink} target="_blank" rel="noopener noreferrer">
                      <FaEye className="text-gray-500 cursor-pointer" />
                    </a>
                    <FaEdit className="text-blue-500 cursor-pointer" />
                    <FaTrashAlt className="text-red-500 cursor-pointer" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-10">
          <div className="flex">
            <button
              className="px-2 py-1 border border-gray-300 rounded-l-md "
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageClick(index + 1)}
                className={`px-3 py-1 border-t border-b border-r border-gray-300 text-blue-500 ${
                  currentPage === index + 1 ? " " : " text-gray-400"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="px-4 py-1 border border-gray-300 rounded-r-md "
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GeneratedBills;
