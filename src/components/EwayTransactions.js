import React, { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom';
import axios from "axios";
import { FaEye} from "react-icons/fa"; 
import {Truck} from 'lucide-react';
import { useSelector,useDispatch } from "react-redux";
import { setTitle } from "../slices/navbarSlice";

const EWayTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const authToken = useSelector((state) => state.auth.authToken); // access from global auth state 
  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(()=>{
    const setNavTitle = () =>{
      dispatch(setTitle('E-Way Transactions'));
    }

    setNavTitle();

  },[setTitle,dispatch])

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (!authToken) {
          setErrorMessage("No token found");
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/ewaytransactions`, {
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
    <div className="p-8 min-h-screen dark:bg-gray-800">
      <div className="mt-5">

      <div className="bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700">
        
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Today's Transactions</h2>
        </div>
        
        <div className="overflow-x-auto">
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-800 dark:border-gray-700">
              
              <p className="text-gray-600 text-lg dark:text-gray-200">No transactions available.</p>
              <p className="text-gray-500 mt-1 dark:text-gray-200">Create your first transaction to get started</p>
            </div>
          ) : (
            <table className="min-w-full bg-white dark:bg-gray-800 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">S.No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">First Party</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">Second Party</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">Total Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">Issue Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">View</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:bg-gray-800 dark:border-gray-700">
                {transactions.map((transaction, index) => (
                  <tr key={transaction._id} className="hover:bg-gray-50 transition-colors dark:hover:bg-gray-600">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{transaction.first_party}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{transaction.second_party}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">
                      {transaction.products.length > 1 
                        ? `${transaction.products[0]} +${transaction.products.length - 1} more`
                        : transaction.products.join(", ")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                      ₹{(transaction.rate.reduce((a, b) => a + b, 0) * transaction.quantity.reduce((a, b) => a + b, 0)).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">
                      {new Date(transaction.created_at).toLocaleString([], { hour12: true, timeStyle: 'short', dateStyle: 'medium' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">
                      <a 
                        href={transaction.downloadlink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors  dark:text-gray-200"
                      >
                        <FaEye className="w-5 h-5" />
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap dark:text-gray-200">
                      <button 
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors dark:bg-blue-800 dark:text-gray-200 dark:hover:bg-blue-700 dark:border-blue-800"
                        onClick={() => handleGenerateEway(transaction._id)}
                      >
                        <Truck className="w-4 h-4 mr-1" />
                        E-Way
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default EWayTransactions;