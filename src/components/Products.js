// Products.js
import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { addRow, removeRow, updateRow } from '../slices/productSlice';

const Products = () => {
  const dispatch = useDispatch();
  const { rows } = useSelector((state) => state.products);
  const { businesses,selectedBusiness } = useSelector((state) => state.business);
  const authToken = useSelector((state) => state.auth.authToken); // access from global auth state 
  const business = businesses?.find((b)=> b._id === selectedBusiness) || {};
  const hsnCodes = business.hsns;

  const handleInputChange = (index, field, value) => {
    dispatch(updateRow({ index, field, value }));
  };

  const handleHSNCode = async (index, field, value) =>{

    dispatch(updateRow({ index, field, value }));

    if(value === "Select HSN Code" || value === "other"){
      handleInputChange(index, "product_info", '');
    }

    if (field === "hsn_code" && value !== "other" && value !== "Select HSN Code") {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/hsn?hsn_code=${value}`, 
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const productInfo = response.data?.product_info?.[0] || "No product info available";

        // Split by "OR" first, then take the first option
        let parts = productInfo.split(/\s+OR\s+/);
    
        // Split the first part by comma and take the first meaningful chunk
        let shortProductInfo = parts[0].split(",")[0].trim();

        handleInputChange(index, "product_info", shortProductInfo);

        console.log(shortProductInfo);

      } catch (error) {
        console.error("Error fetching product info:", error);
        handleInputChange(index, "product_info", '');
      }
   }

  }

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
    <div className="p-6 mt-5 mb-6 bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="mt-4 flex justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Items Details</h2>
        <button
          onClick={() => dispatch(addRow())}
          className="flex items-center bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200 mb-4"
        >
          <FaEdit className="mr-1 text-white" /> Add item
        </button>
      </div>
      <div className="w-full">
        <table className="min-w-full bg-[#F9FAFC] shadow-md">
          <thead className="bg-gray-100 text-[#51535e]">
            <tr>
              <th className="border-b-2 border-r-2 border-black text-black font-medium text-lg w-16" rowSpan="2">S No.</th>
              <th className="border-b-2 border-r-2 border-black text-black font-medium text-lg w-80" rowSpan="2">Item Name</th>
              <th className="border-b-2 border-r-2 border-black text-black font-medium text-lg w-28" rowSpan="2">HSN Code</th>
              <th className="border-b-2 border-r-2 border-black text-black font-medium text-lg w-28" rowSpan="2">Quantity</th>
              <th className="border-b-2 border-r-2 border-black text-black font-medium text-lg w-28" rowSpan="2">Unit</th>
              <th className="border-b-2 border-r-2 border-black text-black font-medium text-lg w-40" rowSpan="2">Price</th>
              <th className="border-b-2 border-r-2 border-black text-black font-medium text-lg w-36" colSpan="2">Tax (%)</th>
              <th className="border-b-2 border-black font-medium text-black text-lg w-36" rowSpan="2">Amount</th>
            </tr>
            <tr>
              <th className="border-b-2 border-r-2 border-black text-black font-normal text-lg">Percent (%)</th>
              <th className="border-b-2 border-r-2 border-black text-black font-normal text-lg">Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} className="border-t">
                <td className="p-1 border-r-2 border-black text-center">{index + 1}</td>
                <td className="p-1 border-r-2 border-black">
                  <input
                    type="text"
                    className="border-2 border-[#EFF0F4] p-2 w-full rounded-md"
                    placeholder="Item Name"
                    value={row.product_info}
                    onChange={(e) => handleInputChange(index, "product_info", e.target.value)}
                  />
                </td>
                {/*<td className="p-1 border-r-2 border-black">
                  <input
                    type="text"
                    className="border-2 border-[#EFF0F4] p-2 w-full rounded-md"
                    placeholder="HSN Code"
                    value={row.hsn_code}
                    onChange={(e) => handleInputChange(index, "hsn_code", e.target.value)}
                  />
                </td>*/}

                 {/* DropDown to Select HSN Codes*/}
                 <td className="p-1 border-r-2 border-black">
                  <select
                    className="border-2 border-[#EFF0F4] p-2 w-full rounded-md"
                    value={row.hsn_code}
                    onChange={(e) => handleHSNCode(index, "hsn_code", e.target.value)}
                  >
                    <option value="Select HSN Code">Select HSN Code</option>
                    {hsnCodes && hsnCodes.map((codeObj) => (
                      <option key={codeObj.hsn} value={codeObj.hsn}>
                        {codeObj.hsn}
                      </option>
                    ))}
                    <option value={row.custom_hsn}>Other</option>
                  </select>

                  {row.hsn_code === "other" && (
                    <input
                      type="text"
                      className="border-2 border-[#EFF0F4] p-2 w-full rounded-md mt-2"
                      placeholder="Enter HSN Code"
                      value={row.custom_hsn || ""}
                      onChange={(e) => handleInputChange(index, "custom_hsn", e.target.value)}
                    />
                  )}
                </td>

                <td className="p-1 border-r-2 border-black">
                  <input
                    type="number"
                    className="border-2 border-[#EFF0F4] p-2 w-full rounded-md"
                    placeholder="Qty"
                    value={row.quantity}
                    onChange={(e) => handleInputChange(index, "quantity", Number(e.target.value))}
                  />
                </td>
                <td className="p-1 border-r-2 border-black">
                  <select
                    className="border-2 border-[#EFF0F4] p-2 w-full rounded-md"
                    value={row.unit}
                    onChange={(e) => handleInputChange(index, "unit", e.target.value)}
                  >
                    <option value="Kgs">Kgs</option>
                    <option value="L">L</option>
                    <option value="Pcs">Pcs</option>
                  </select>
                </td>
                <td className="p-1 border-r-2 border-black">
                  <input
                    type="number"
                    className="border-2 border-[#EFF0F4] p-2 w-full rounded-md"
                    placeholder="Price"
                    value={row.price}
                    onChange={(e) => handleInputChange(index, "price", Number(e.target.value))}
                  />
                </td>
                <td className="p-1 border-r-2 border-black">
                  <input
                    type="number"
                    className="border-2 border-[#EFF0F4] p-2 w-full rounded-md"
                    placeholder="Tax %"
                    value={row.taxPercent}
                    onChange={(e) => handleInputChange(index, "taxPercent", Number(e.target.value))}
                  />
                </td>
                <td className="p-1 border-r-2 border-black">
                  <input
                    type="number"
                    className="border-2 border-[#EFF0F4] p-2 w-full rounded-md"
                    placeholder="Tax Amount"
                    value={row.taxAmount}
                    readOnly
                  />
                </td>
                <td className="p-1 flex justify-between items-center">
                  <input
                    type="number"
                    className="border-2 border-[#EFF0F4] p-2 w-full rounded-md"
                    placeholder="Amount"
                    value={row.amount}
                    readOnly
                  />
                  <button 
                    onClick={() => dispatch(removeRow(index))} 
                    className="text-black hover:text-gray-700 flex items-center ml-2"
                  >
                    <FaTrash className="mr-1" />
                  </button>
                </td>
              </tr>
            ))}
            <tr className="font-semibold bg-[#989baaa7] text-black">
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