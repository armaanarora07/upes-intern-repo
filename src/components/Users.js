import React, { useEffect, useState } from 'react';
import {FaMoneyCheckAlt} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { setTitle } from '../slices/navbarSlice';

const Users = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {

    const setNavTitle = () =>{
      dispatch(setTitle('Users Transactions'));
    }

    setNavTitle();

  }, [setTitle,dispatch]);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/user/transaction`,
          {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setData(result.data || []); // Extract "data" array from the response
        setFilteredData(result.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  
    const filtered = data.filter((item) =>
      (item.first_party && item.first_party.toLowerCase().includes(term)) ||
      (item.second_party && item.second_party.toLowerCase().includes(term)) ||
      (item.products &&
        item.products.some((product) =>
          product && product.toLowerCase().includes(term)
        ))
    );
    setFilteredData(filtered);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-8 mt-10">
    <div className='mt-5'>
      
      <input
        type="text"
        placeholder="Search by First Party, Second Party, or Product..."
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4 p-2 border border-gray-300 rounded w-full max-w-md"
      />
      
      <div className="p-2 overflow-x-auto">
      <table className="w-[1150px] border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">S.No</th>
            <th className="border border-gray-300 p-2">First Party</th>
            <th className="border border-gray-300 p-2">Second Party</th>
            <th className="border border-gray-300 p-2">Product</th>
            <th className="border border-gray-300 p-2">Rate</th>
            <th className="border border-gray-300 p-2">Quantity</th>
            <th className="border border-gray-300 p-2">Total Value</th>
            <th className="border border-gray-300 p-2">Download</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={item._id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2">{item.sn_no}</td>
              <td className="border border-gray-300 p-2">{item.first_party}</td>
              <td className="border border-gray-300 p-2">{item.second_party}</td>
              <td className="border border-gray-300 p-2">{item.products?.join(', ')}</td>
              <td className="border border-gray-300 p-2">{item.rate?.join(', ')}</td>
              <td className="border border-gray-300 p-2">{item.quantity?.join(', ')}</td>
              <td className="border border-gray-300 p-2">{item.total_value}</td>
              <td className="border border-gray-300 p-2">
                <a
                  href={item.downloadlink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4154f1] underline"
                >
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      </div>
    </div>
  );
};

export default Users;
