import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { useSelector,useDispatch } from "react-redux";
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
  const [legal_name, setLegalName] = useState(""); // State for legal_name
  const authToken = useSelector((state) => state.auth.authToken); // access from global auth state 
  const dispatch = useDispatch();

  useEffect(()=>{
    
    const setNavTitle = () =>{
      dispatch(setTitle('Dashboard'));
    }

    setNavTitle();
  },[setTitle,dispatch])

  useEffect(() => {
    const fetchData = async () => {

      if (!authToken) {
        setErrorMessage("You need to log in first.");
        setLoading(false);
        return;
      }

      try {
        // Fetch transactions data
        const transactionResponse = await axios.get("/user/myTransactions", {
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

        // Fetch business legal name
        const businessResponse = await axios.get("/user/myBusiness", {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });
        const businessData = businessResponse.data?.data || [];
        if (businessData.length > 0) {
          setLegalName(businessData[0]?.legal_name || "N/A");
        } else {
          setLegalName("No businesses found");
        }
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
    
      <div className="text-2xl font-bold text-gray-800 mt-3">
        {legal_name} 
      </div>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {/* <div className="mb-6 p-4 border rounded shadow-sm bg-white">
        <h2 className="text-lg font-semibold">Business Name</h2>
      </div> */}
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
