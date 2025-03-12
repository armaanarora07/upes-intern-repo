import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { useSelector,useDispatch } from "react-redux";
import {checkAndFetchBusinesses,setBusiness} from '../slices/businessSlice';
import { setTitle } from '../slices/navbarSlice';
import { logout } from "../slices/authSlice";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [allTransactions,setAllTransactions] = useState([]);
  const [filter,setFilter] = useState('thisMonth');
  const filters = [
    { id: 'today', name: 'Today' },
    { id: 'thisWeek', name: 'This Week' },
    { id: 'thisMonth', name: 'This Month' },
    { id: 'thisQuarter', name: 'This Quarter' },
    { id: 'currentFinancialYear', name: 'Current Financial Year' },
    { id: 'previousFinancialYear', name: 'Previous Financial Year' }
  ];
  const [transactions, setTransactions] = useState([]);
  const [salesData, setSalesData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const authToken = useSelector((state) => state.auth.authToken); // access from global auth state 
  const {businesses,selectedBusiness} = useSelector((state)=> state.business);
  const [business, setSelectedBusiness] = useState(
    () => businesses?.find((b) => b._id === selectedBusiness) || {}
  );
  const [legal_name, setLegalName] = useState(business ? business.legal_name : ''); // State for legal_name

  const [GSTSalesData, setGSTSalesData] = useState(null);
  const [URDSalesData, setURDSalesData] = useState(null);
  const [URDPurchaseData, setURDPurchaseData] = useState(null);

  const [totalSales, setTotalSales] = useState(0);
  const [totalGSTSales, setTotalGSTSales] = useState(0);
  const [totalURDSales, setTotalURDSales] = useState(0);
  const [totalURDPurchases, setTotalURDPurchases] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {

    setSelectedBusiness(businesses?.find((b) => b._id === selectedBusiness) || {});

    setLegalName(business ? business.legal_name : '');

    if(errorMessage === 'Invalid Token'){ // Logging out on Invalid Token
      // Clear user session
      dispatch(logout());
      navigate("/login"); // Redirect to login page
    }

  }, [businesses, selectedBusiness,business, errorMessage,dispatch,navigate]);

  useEffect(()=>{

    dispatch(checkAndFetchBusinesses());

    if (businesses.length === 1) {
      handleDropdown(businesses[0]._id);
    } 

    const setNavTitle = () =>{
      dispatch(setTitle('Dashboard'));
    }

    setNavTitle();
  },[dispatch,businesses])

  useEffect(() => {
    const fetchData = async () => {

      if (!authToken) {
        setErrorMessage("You need to log in first.");
        setLoading(false);
        return;
      }

      try {
        // Fetch transactions data
        const transactionResponse = await axios.get(`${process.env.REACT_APP_API_URL}/user/myTransactions`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        const transactions = transactionResponse.data?.data || [];
        
        setAllTransactions(transactions);
       
      } catch (error) {
        if (error.response) {
          setErrorMessage(error.response.data.message || "An error occurred on the server.");
        } else if (error.request) {
          setErrorMessage("No response received from the server.");
        } else {
          setErrorMessage("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };
        
    fetchData();

  }, [authToken]);

  function filterDataByDateRange(data, range) {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Monday
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfQuarter = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
    const currentFinancialYearStart = new Date(today.getMonth() < 3 ? today.getFullYear() - 1 : today.getFullYear(), 3, 1);
    const previousFinancialYearStart = new Date(currentFinancialYearStart.getFullYear() - 1, 3, 1);
    const previousFinancialYearEnd = new Date(currentFinancialYearStart.getFullYear(), 2, 31);

    return data.filter(entry => {
        const entryDate = new Date(entry.created_at);

        switch (range) {
            case 'today':
                return entryDate.toDateString() === new Date().toDateString();
            case 'thisWeek':
                return entryDate >= startOfWeek;
            case 'thisMonth':
                return entryDate >= startOfMonth;
            case 'thisQuarter':
                return entryDate >= startOfQuarter;
            case 'currentFinancialYear':
                return entryDate >= currentFinancialYearStart;
            case 'previousFinancialYear':
                return entryDate >= previousFinancialYearStart && entryDate <= previousFinancialYearEnd;
            default:
                return true; // Return all data if no filter is applied
        }
    });
  }

  useEffect(()=>{

    const filteredData = filterDataByDateRange(allTransactions,filter); 
    setTransactions(filteredData);

    const sales = transactions.map((txn) => ({
      date: new Date(txn.created_at).toLocaleDateString(),
      amount: txn.total_value || 0,
    }));
  
    let TotalSales = 0;
  
    sales.forEach(element => {
      TotalSales += Number(element.amount);
    });
  
    setTotalSales(TotalSales.toFixed(2));
    setSalesData(sales);
  
    const urdPurchaseTransactions = transactions.filter(entry => entry.second_party === "" || entry.second_party === null);
  
    const urdPurchaseData = urdPurchaseTransactions.map((txn) => ({
      date: new Date(txn.created_at).toLocaleDateString(),
      amount: txn.total_value || 0,
    }));
  
    let TotalURDPurchases = 0;
  
    urdPurchaseData.forEach(element => {
      TotalURDPurchases += Number(element.amount);
    });
    
    setTotalURDPurchases(TotalURDPurchases.toFixed(2));
    setURDPurchaseData(urdPurchaseData);
  
    const urdSalesTransactions = transactions.filter(entry => /^[0-9]{10}$/.test(entry.second_party));
  
    const urdSalesData = urdSalesTransactions.map((txn) => ({
      date: new Date(txn.created_at).toLocaleDateString(),
      amount: txn.total_value || 0,
    }));
  
    let TotalURDSales = 0;
  
    urdSalesData.forEach(element => {
      TotalURDSales += Number(element.amount);
    });
    
    setTotalURDSales(TotalURDSales.toFixed(2));
    setURDSalesData(urdSalesData);
  
    const gstSalesTransactions = transactions.filter(entry => /^[0-9A-Z]{15}$/.test(entry.second_party));
  
    const gstSalesData = gstSalesTransactions.map((txn) => ({
      date: new Date(txn.created_at).toLocaleDateString(),
      amount: txn.total_value || 0,
    }));
  
    let TotalGSTSales = 0;
  
    gstSalesData.forEach(element => {
      TotalGSTSales += Number(element.amount);
    });
  
    setTotalGSTSales(TotalGSTSales.toFixed(2));
    setGSTSalesData(gstSalesData);
  

  },[allTransactions,transactions,filterDataByDateRange,filter]);
  
  const handleDropdown = (value) =>{
    dispatch(setBusiness(value));
  }

  const handleFilterDropdown = (value) =>{
    setFilter(value);
  }

  const chartData = salesData
    ? {
        labels: salesData.map((item) => item.date),
        datasets: [
          {
            label: "Sales Over Time",
            data: salesData.map((item) => item.amount),
            borderColor: "rgba(65, 84, 241, 0.5)",
            backgroundColor: "rgba(65, 84, 241, 0.5)",
            tension: 0.4,
          },
        ],
      }
    : {};

    const URDSalesChartData = URDSalesData
    ? {
        labels: URDSalesData.map((item) => item.date),
        datasets: [
          {
            label: "URD Sales Over Time",
            data: URDSalesData.map((item) => item.amount),
            borderColor: "rgba(65, 84, 241, 0.5)",
            backgroundColor: "rgba(65, 84, 241, 0.5)",
            tension: 0.4,
          },
        ],
      }
    : {};

    const URDPurchaseChartData = URDPurchaseData
    ? {
        labels: URDPurchaseData.map((item) => item.date),
        datasets: [
          {
            label: "URD Purchases Over Time",
            data: URDPurchaseData.map((item) => item.amount),
            borderColor: "rgba(65, 84, 241, 0.5)",
            backgroundColor: "rgba(65, 84, 241, 0.5)",
            tension: 0.4,
          },
        ],
      }
    : {};

    const GSTChartData = GSTSalesData
    ? {
        labels: GSTSalesData.map((item) => item.date),
        datasets: [
          {
            label: "GST Sales Over Time",
            data: GSTSalesData.map((item) => item.amount),
            borderColor: "rgba(65, 84, 241, 0.5)",
            backgroundColor: "rgba(65, 84, 241, 0.5)",
            tension: 0.4,
          },
        ],
      }
    : {};

  if (loading) {
    return (
      <div className="p-8 mt-10">
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">

      <div className="max-w-7xl mx-auto">
  
        {/* Dashboard Content */}
        <div className="p-6">

          {allTransactions.length > 0 ? (
            <>
              {/* Header with improved alignment */}
              <div className="px-6 py-5 mb-6 bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Business Name */}
                  <h1 className="text-2xl font-bold text-gray-800">
                    {legal_name}
                  </h1>

                  <div className="flex space-x-3">

                      {/* Business Selector */}
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-700 font-medium">Select Business</span>
                        <select 
                          className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                          onChange={(e) => handleDropdown(e.target.value)}
                        >
                          {businesses.map((business, key) => (
                            <option key={key} value={business._id}>
                              {business.legal_name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Filter Selector */}
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-700 font-medium">Filter</span>
                        <select 
                          className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                          value={filter}
                          onChange={(e) => handleFilterDropdown(e.target.value)}
                        >
                            {filters.map((filter, key) => (
                            <option key={key} value={filter.id}>
                              {filter.name} 
                            </option>
                          ))}
                        </select>
                      </div>

                  </div>
                  
                </div>

                {/* Error message with better positioning */}
                {errorMessage && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
                    {errorMessage}
                  </div>
                )}

              </div>

               {/* Analytics Cards */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {[
                  { label: "Total Sales", value: totalSales },
                  { label: "Total GST Sales", value: totalGSTSales },
                  { label: "Total URD Sales", value: totalURDSales },
                  { label: "Total URD Purchases", value: totalURDPurchases }
                ].map(({ label, value }, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-lg border rounded-3xl p-6 w-full h-40 transform transition-all duration-300 hover:scale-105"
                  >
                    <h2 className="text-4xl text-center text-gray-800 mt-2">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        minimumFractionDigits: 2
                      }).format(value)}
                    </h2>
                    <p className="text-center text-black text-lg font-medium mt-4">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Latest Transactions Card - Improved styling */}
              <div className="mb-6">
                <div className="bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Latest Transactions</h2>
                  </div>
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Bill ID</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Bill For</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {transactions.slice(0, 5).map((txn, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{txn.sn_no || "N/A"}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {txn.created_at ? new Date(txn.created_at).toLocaleDateString() : "N/A"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{txn.name || "N/A"}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹ {txn.total_value ? txn.total_value.toLocaleString() : "0"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 text-right">
                      <Link to="/generated-bills" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                        See All Transactions
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Grid - Improved layout and responsiveness */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Total Sales Report */}
                <div className="bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Total Sales Report</h2>
                  </div>
                  <div className="p-6 h-80">
                    {salesData ? (
                      <Line
                        data={chartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'top',
                              labels: {
                                boxWidth: 10,
                                usePointStyle: true,
                                padding: 20
                              }
                            },
                            tooltip: {
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              titleColor: '#111827',
                              bodyColor: '#4B5563',
                              borderColor: '#E5E7EB',
                              borderWidth: 1,
                              padding: 12,
                              boxPadding: 6,
                              usePointStyle: true
                            }
                          },
                          scales: {
                            x: {
                              grid: {
                                display: false
                              },
                              title: { 
                                display: true, 
                                text: "Date",
                                padding: {top: 10}
                              }
                            },
                            y: {
                              grid: {
                                borderDash: [2, 4],
                                color: '#E5E7EB'
                              },
                              title: { 
                                display: true, 
                                text: "Sales (₹)",
                                padding: {bottom: 10}
                              },
                              beginAtZero: true
                            }
                          }
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No sales data available.</p>
                      </div>
                    )}
                  </div>
                </div>
  
                {/* GST Sales Report */}
                <div className="bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">GST Sales Report</h2>
                  </div>
                  <div className="p-6 h-80">
                    {GSTSalesData ? (
                      <Line
                        data={GSTChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'top',
                              labels: {
                                boxWidth: 10,
                                usePointStyle: true,
                                padding: 20
                              }
                            },
                            tooltip: {
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              titleColor: '#111827',
                              bodyColor: '#4B5563',
                              borderColor: '#E5E7EB',
                              borderWidth: 1,
                              padding: 12,
                              boxPadding: 6,
                              usePointStyle: true
                            }
                          },
                          scales: {
                            x: {
                              grid: {
                                display: false
                              },
                              title: { 
                                display: true, 
                                text: "Date",
                                padding: {top: 10}
                              }
                            },
                            y: {
                              grid: {
                                borderDash: [2, 4],
                                color: '#E5E7EB'
                              },
                              title: { 
                                display: true, 
                                text: "Sales (₹)",
                                padding: {bottom: 10}
                              },
                              beginAtZero: true
                            }
                          }
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No GST sales data available.</p>
                      </div>
                    )}
                  </div>
                </div>
  
                {/* URD Sales Report */}
                <div className="bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">URD Sales Report</h2>
                  </div>
                  <div className="p-6 h-80">
                    {URDSalesData ? (
                      <Line
                        data={URDSalesChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'top',
                              labels: {
                                boxWidth: 10,
                                usePointStyle: true,
                                padding: 20
                              }
                            },
                            tooltip: {
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              titleColor: '#111827',
                              bodyColor: '#4B5563',
                              borderColor: '#E5E7EB',
                              borderWidth: 1,
                              padding: 12,
                              boxPadding: 6,
                              usePointStyle: true
                            }
                          },
                          scales: {
                            x: {
                              grid: {
                                display: false
                              },
                              title: { 
                                display: true, 
                                text: "Date",
                                padding: {top: 10}
                              }
                            },
                            y: {
                              grid: {
                                borderDash: [2, 4],
                                color: '#E5E7EB'
                              },
                              title: { 
                                display: true, 
                                text: "Sales (₹)",
                                padding: {bottom: 10}
                              },
                              beginAtZero: true
                            }
                          }
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No URD sales data available.</p>
                      </div>
                    )}
                  </div>
                </div>
  
                {/* URD Purchases Report */}
                <div className="bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">URD Purchases Report</h2>
                  </div>
                  <div className="p-6 h-80">
                    {URDPurchaseData ? (
                      <Line
                        data={URDPurchaseChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'top',
                              labels: {
                                boxWidth: 10,
                                usePointStyle: true,
                                padding: 20
                              }
                            },
                            tooltip: {
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              titleColor: '#111827',
                              bodyColor: '#4B5563',
                              borderColor: '#E5E7EB',
                              borderWidth: 1,
                              padding: 12,
                              boxPadding: 6,
                              usePointStyle: true
                            }
                          },
                          scales: {
                            x: {
                              grid: {
                                display: false
                              },
                              title: { 
                                display: true, 
                                text: "Date",
                                padding: {top: 10}
                              }
                            },
                            y: {
                              grid: {
                                borderDash: [2, 4],
                                color: '#E5E7EB'
                              },
                              title: { 
                                display: true, 
                                text: "Purchases (₹)",
                                padding: {bottom: 10}
                              },
                              beginAtZero: true
                            }
                          }
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No URD Purchases data available.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm">
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p className="text-gray-600 text-lg">No recent transactions available.</p>
              <p className="text-gray-500 mt-1">Transactions will appear here once they're recorded in the system.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
