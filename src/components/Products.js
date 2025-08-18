import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { addRow, removeRow, updateRow } from '../slices/productSlice';
import { Trash2 } from 'lucide-react';

const Products = () => {
  const dispatch = useDispatch();
  const { rows } = useSelector((state) => state.products);
  const { businesses, selectedBusiness } = useSelector((state) => state.business);
  const authToken = useSelector((state) => state.auth.authToken);
  const business = businesses?.find((b) => b._id === selectedBusiness) || {};
  const [hsnData, setHsnData] = useState([]);
  
  // Add state for suggestions and active field
  const [suggestions, setSuggestions] = useState([]);
  const [activeRowIndex, setActiveRowIndex] = useState(null);
  const suggestionRef = useRef(null);
  
  // Maximum number of suggestions to show
  const MAX_SUGGESTIONS = 20; // Increased from default
  
  // Fetch HSN data when component mounts
  useEffect(() => {
    const fetchHsnData = async () => {
      if (business.gstin) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/hsn/local?gstin=${business.gstin}`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          });
          
          if (response.data.status && response.data.data) {
            setHsnData(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching HSN data:", error);
        }
      }
    };
    
    fetchHsnData();
  }, [business.gstin, authToken]);

  // Add click outside handler to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setSuggestions([]);
        setActiveRowIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (index, field, value) => {
    dispatch(updateRow({ index, field, value }));
    
    // Show suggestions only when editing HSN code
    if (field === "hsn_code") {
      // Set the active row and filter suggestions
      setActiveRowIndex(index);
      
      if (value) {
        // Get all HSN codes that start with the input value
        const filteredSuggestions = hsnData
          .filter(item => item.hsn.toString().startsWith(value))
          .map(item => item.hsn);
          
        // Get unique HSN codes
        const uniqueSuggestions = [...new Set(filteredSuggestions)];
        
        // Sort suggestions numerically and limit to MAX_SUGGESTIONS
        const sortedSuggestions = uniqueSuggestions
          .sort((a, b) => parseInt(a) - parseInt(b))
          .slice(0, MAX_SUGGESTIONS);
          
        setSuggestions(sortedSuggestions);
      } else {
        setSuggestions([]);
      }
      
      // Don't populate fields on partial matches, only when exact match
    //   const exactMatch = hsnData.find(item => item.hsn === value);
    //   if (exactMatch) {
    //     populateFields(index, exactMatch);
    //   } else {
    //     clearPopulatedFields(index);
    //   }
    // }
      // issue resolved of disappering of name when hsn code is entered - by sagar
      // Only populate fields on an exact match, otherwise do nothing.
     const exactMatch = hsnData.find(item => item.hsn === value);
      if (exactMatch) {
        populateFields(index, exactMatch);
      }
    }
  };
  
  // Function to select a suggestion
  const handleSelectSuggestion = (index, hsnCode) => {
    // Update the HSN code field
    dispatch(updateRow({ index, field: "hsn_code", value: hsnCode }));
    
    // Find and populate the HSN data
    const matchedHsn = hsnData.find(item => item.hsn === hsnCode);
    if (matchedHsn) {
      populateFields(index, matchedHsn);
    }
    
    // Clear suggestions
    setSuggestions([]);
    setActiveRowIndex(null);
  };
  
  // Function to populate fields based on HSN data
  const populateFields = (index, hsnData) => {
    dispatch(updateRow({ index, field: "product_info", value: hsnData.productName }));
    dispatch(updateRow({ index, field: "taxPercent", value: hsnData.gst_rate }));
    dispatch(updateRow({ index, field: "unit", value: hsnData.unit }));
  };
  
  // Function to clear auto-populated fields when HSN doesn't match
  const clearPopulatedFields = (index) => {
    dispatch(updateRow({ index, field: "product_info", value: "" }));
    dispatch(updateRow({ index, field: "taxPercent", value: 0 }));
    // Don't reset unit as user might want to keep it
  };

  const totalQuantity = rows.reduce(
    (sum, row) => sum + (Number(row.quantity) || 0),
    0
  );

  const totalTax = rows.reduce(
    (sum, row) => sum + (Number(row.taxAmount) || 0),
    0
  );

  const totalAmount = rows.reduce(
    (sum, row) => sum + (Number(row.amount) || 0),
    0
  );

  return (
    <div className="p-6 mt-5 mb-6 bg-white border dark:bg-gray-800 dark:border-gray-700 rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="mt-4 flex justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Items Details</h2>
        <button
          onClick={() => dispatch(addRow())}
          className="flex items-center text-white p-2 rounded-lg hover:bg-blue-600 bg-blue-500 text-white transition duration-200 mb-4 dark:bg-blue-800 dark:text-gray-200 dark:hover:bg-blue-700"
        >
          <FaEdit className="mr-1 text-white" /> Add item
        </button>
      </div>
      <div className="w-full">
        <table className="min-w-full bg-[#F9FAFC] dark:bg-gray-800 dark:border-gray-700 shadow-md">
          <thead className="bg-gray-100 text-[#51535e] dark:bg-gray-800 dark:border-gray-700 shadow-md">
            <tr>
              <th className="border-b-2 border-r-2 border-black text-black font-medium text-lg w-16 dark:text-gray-200" rowSpan="2">S No.</th>
              <th className="border-b-2 border-r-2 border-black text-black font-medium text-lg w-80 dark:text-gray-200" rowSpan="2">Item Name</th>
              <th className="border-b-2 border-r-2 border-black text-black font-medium text-lg w-28 dark:text-gray-200" rowSpan="2">HSN Code</th>
              <th className="border-b-2 border-r-2 border-black text-black font-medium text-lg w-28 dark:text-gray-200" rowSpan="2">Quantity</th>
              <th className="border-b-2 border-r-2 border-black text-black font-medium text-lg w-28 dark:text-gray-200" rowSpan="2">Unit</th>
              <th className="border-b-2 border-r-2 border-black text-black font-medium text-lg w-40 dark:text-gray-200" rowSpan="2">Price</th>
              <th className="border-b-2 border-r-2 border-black text-black font-medium text-lg w-36 dark:text-gray-200" colSpan="2">Tax (%)</th>
              <th className="border-b-2 border-black font-medium text-black text-lg w-36 dark:text-gray-200" rowSpan="2">Amount</th>
            </tr>
            <tr>
              <th className="border-b-2 border-r-2 border-black text-black font-normal text-lg dark:text-gray-200">Percent (%)</th>
              <th className="border-b-2 border-r-2 border-black text-black font-normal text-lg dark:text-gray-200">Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} className="border-t dark:bg-gray-800 dark:border-gray-900">
                <td className="p-1 border-r-2 border-black text-center dark:text-gray-200">{index + 1}</td>
                <td className="p-1 border-r-2 border-black dark:text-gray-200">
                  <input
                    type="text"
                    className="border-2 border-[#EFF0F4] p-2 w-full rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
                    placeholder="Item Name"
                    value={row.product_info}
                    onChange={(e) => handleInputChange(index, "product_info", e.target.value)}
                  />
                </td>
                <td className="p-1 border-r-2 border-black relative">
                  <input
                    type="text"
                    className="border-2 border-[#EFF0F4] p-2 w-full rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
                    placeholder="HSN Code"
                    value={row.hsn_code}
                    onChange={(e) => handleInputChange(index, "hsn_code", e.target.value)}
                  />
                  {/* Autocomplete suggestions dropdown */}
                  {suggestions.length > 0 && activeRowIndex === index && (
                    <div 
                      ref={suggestionRef}
                      className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                    >
                      <ul>
                        {suggestions.map((suggestion, i) => (
                          <li 
                            key={i}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                            onClick={() => handleSelectSuggestion(index, suggestion)}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </td>
                <td className="p-1 border-r-2 border-black ">
                  <input
                    type="number"
                    className="border-2 border-[#EFF0F4] p-2 w-full rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
                    placeholder="Qty"
                    value={row.quantity}
                    onChange={(e) => handleInputChange(index, "quantity", Number(e.target.value))}
                  />
                </td>
                <td className="p-1 border-r-2 border-black">
                  <select
                    className="border-2 border-[#EFF0F4] p-2 w-full rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
                    value={row.unit}
                    onChange={(e) => handleInputChange(index, "unit", e.target.value)}
                  >
                    <option value="Kgs">Kgs</option>
                    <option value="L">L</option>
                    <option value="Pcs">Pcs</option>
                    <option value="Nos">Nos</option>
                  </select>
                </td>
                <td className="p-1 border-r-2 border-black">
                  <input
                    type="number"
                    className="border-2 border-[#EFF0F4] p-2 w-full rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
                    placeholder="Price"
                    value={row.price}
                    onChange={(e) => handleInputChange(index, "price", Number(e.target.value))}
                  />
                </td>
                <td className="p-1 border-r-2 border-black">
                  <input
                    type="number"
                    className="border-2 border-[#EFF0F4] p-2 w-full rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
                    placeholder="Tax %"
                    value={row.taxPercent}
                    onChange={(e) => handleInputChange(index, "taxPercent", Number(e.target.value))}
                  />
                </td>
                <td className="p-1 border-r-2 border-black">
                  <input
                    type="number"
                    className="border-2 border-[#EFF0F4] p-2 w-full rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
                    placeholder="Tax Amount"
                    value={row.taxAmount}
                    readOnly
                  />
                </td>
                <td className="p-1 flex justify-between items-center">
                  <input
                    type="number"
                    className="border-2 border-[#EFF0F4] p-2 w-full rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
                    placeholder="Amount"
                    value={row.amount}
                    readOnly
                  />
                  <button 
                    onClick={() => dispatch(removeRow(index))} 
                    className="text-black hover:text-gray-700 flex items-center ml-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            <tr className="font-semibold bg-[#989baaa7] text-black dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4154f1]">
              <td colSpan="3" className="p-3 text-right border-r-2 border-black">
                TOTAL
              </td>
              <td className="p-3 border-r-2 border-black text-right">
                {totalQuantity}
              </td>
              <td className="p-3 border-r-2 border-black text-right"></td>
              <td className="p-3 border-r-2 border-black text-right"></td>
              <td className="p-3 border-r-2 border-black text-right"></td>
              <td className="p-3 border-r-2 border-black text-right">
                {totalTax.toFixed(2)}
              </td>
              <td className="p-3 text-right">{totalAmount}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;