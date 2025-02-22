import React, { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom';
import axios from "axios";
import { FaEye, FaFileAlt } from "react-icons/fa"; 
import { useSelector } from "react-redux";

const EWayTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const authToken = useSelector((state) => state.auth.authToken); // access from global auth state 
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (!authToken) {
          setErrorMessage("No token found");
          return;
        }

        const response = await axios.get('https://fyntl.sangrahinnovations.com/user/ewaytransactions', {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data.status) {
          setTransactions(response.data.data);
        } else {
          setErrorMessage("Failed to retrieve transactions: " + response.data.message);
        }

      } catch (error) {
        setErrorMessage("Error fetching transactions: " + (error.response ? error.response.data.message : error.message));
      }
    };

    fetchTransactions();
  }, [authToken]);

  const handleGenerateEway =(billdocId)=>{
      navigate(`/EWayBillRequest?billid=${billdocId}`);
  }

  return (
    <div className="p-6">
      <div className="flex items-center space-x-3 text-[#4154f1] font-bold text-3xl mb-6">
        <FaFileAlt className="text-4xl" />
        <span>E-Way Transactions</span>
      </div>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">S.No</th>
            <th className="px-4 py-2 text-left">First Party</th>
            <th className="px-4 py-2 text-left">Second Party</th>
            <th className="px-4 py-2 text-left">Product</th>
            <th className="px-4 py-2 text-left">Total Price</th>
            <th className="px-4 py-2 text-left">Issue Date</th>
            <th className="px-4 py-2 text-left">View Bill</th>
            <th className="px-4 py-2 text-left">E-Way Generate</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={transaction._id}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{transaction.first_party}</td>
              <td className="border px-4 py-2">{transaction.second_party}</td>
              <td className="border px-4 py-2">{transaction.products.join(", ")}</td>
              <td className="border px-4 py-2">{transaction.rate.reduce((a, b) => a + b, 0) * transaction.quantity.reduce((a, b) => a + b, 0)}</td>
              <td className="border px-4 py-2">
                {new Date(transaction.created_at).toLocaleString([], { hour12: true, timeStyle: 'short', dateStyle: 'medium' })}
              </td>
              <td className="border px-4 py-2">
                <a href={transaction.downloadlink} target="_blank" rel="noopener noreferrer">
                  <FaEye className="text-gray-500 cursor-pointer" />
                </a>
              </td>
              <td className="border px-4 py-2">
                <button className="bg-blue-500 text-white py-1 px-2 rounded" onClick={()=>{handleGenerateEway(transaction._id)}}>Generate E-Way</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EWayTransactions;