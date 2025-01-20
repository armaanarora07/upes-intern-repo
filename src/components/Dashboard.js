import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Line } from "react-chartjs-2";

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { FaEye } from "react-icons/fa";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [salesData, setSalesData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setErrorMessage("You need to log in first.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("/user/myTransactions", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const transactions = response.data?.data || [];
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

  const chartData = salesData ? {
    labels: salesData.map(item => item.date),  
    datasets: [
      {
        label: "Sales Over Time",
        data: salesData.map(item => item.amount),  
        borderColor: "rgba(65, 84, 241, 0.5)",
        backgroundColor: "rgba(65, 84, 241, 0.5)",
        tension: 0.4,
      },
    ],
  } : {};
  console.log(chartData);
  

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-3xl font-bold text-[#4154f1]">Dashboard</h1>
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-[#4154f1]">Dashboard</h1>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

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
                    <td className="py-2 px-4">{txn.created_at ? new Date(txn.created_at).toLocaleDateString() : "N/A"}</td>
                    <td className="py-2 px-4">{txn.name || "N/A"}</td>
                    <td className="py-2 px-4">₹ {txn.total_value ? txn.total_value.toLocaleString() : "0"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Link to="/trans" className="text-[#4154f1] hover:underline mt-2 block">
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
  );
};

export default Dashboard;
