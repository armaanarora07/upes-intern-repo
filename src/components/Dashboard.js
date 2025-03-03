import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { useSelector,useDispatch } from "react-redux";
import {checkAndFetchBusinesses,setBusiness} from '../slices/businessSlice';
import { setTitle } from '../slices/navbarSlice';

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

  const dispatch = useDispatch();

  useEffect(() => {

    setSelectedBusiness(businesses?.find((b) => b._id === selectedBusiness) || {});

    setLegalName(business ? business.legal_name : '');

  }, [businesses, selectedBusiness,business]);

  useEffect(()=>{

    dispatch(checkAndFetchBusinesses());

    if (businesses.length === 1) {
      handleDropdown(businesses[0]._id);
    } 

    const setNavTitle = () =>{
      dispatch(setTitle('Dashboard'));
    }

    setNavTitle();
  },[setTitle,dispatch,businesses])

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
        setTransactions(transactions);
        const sales = transactions.map((txn) => ({
          date: new Date(txn.created_at).toLocaleDateString(),
          amount: txn.total_value || 0,
        }));

        setSalesData(sales);

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
  }, []);

  const handleDropdown = (value) =>{
     dispatch(setBusiness(value));
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

  if (loading) {
    return (
      <div className="p-8 mt-10">
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div className="p-8 mt-10">
    
      <div className="flex items-center justify-between mt-3">
        {/* Business Name */}
        <div className="text-2xl font-bold text-gray-800">
          {`${legal_name}`} 
        </div>

        {/* Dropdown Section */}
        <div className="flex items-center space-x-2 ml-auto">
          <span className="text-gray-800 font-bold">Select Business</span>
          <select 
            className="border rounded px-3 py-1" 
            onChange={(e) => handleDropdown(e.target.value)}
          >
              {businesses.map((business, key) => (
                <option key={key} value={business._id}>
                  {business.legal_name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <div className="flex space-x-12">
      {transactions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 py-8 px-5 gap-4">
          <div className="border p-4 rounded shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Latest Transactions</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4">Bill ID</th>
                  <th className="py-2 px-4">DATE</th>
                  <th className="py-2 px-4">Bill For</th>
                  <th className="py-2 px-4">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 5).map((txn, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">{txn.sn_no || "N/A"}</td>
                    <td className="py-2 px-4">
                      {txn.created_at ? new Date(txn.created_at).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="py-2 px-4">{txn.name || "N/A"}</td>
                    <td className="py-2 px-4">₹ {txn.total_value ? txn.total_value.toLocaleString() : "0"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Link to="/generated-bills" className="text-[#4154f1] hover:underline mt-2 block">
              See All Transactions
            </Link>
          </div>

          <div className="border p-4 rounded shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Sales Report</h2>
            {salesData ? (
              <div>
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    scales: {
                      x: {
                        title: { display: true, text: "Date" },
                      },
                      y: {
                        title: { display: true, text: "Sales (₹)" },
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            ) : (
              <p>No sales data available.</p>
            )}
          </div>
        </div>
      ) : (
        <p>No recent transactions available.</p>
      )}
      </div>
    </div>
  );
};

export default Dashboard;
