import React, { useState } from "react";
import {FaReceipt, FaFileAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Sample data for businesses
const sampleBusinesses = [
  { id: 1, name: "Business A" },
  { id: 2, name: "Business B" },
  { id: 3, name: "Business C" },
];

const GenerateNewBill = () => {
  const navigate = useNavigate();
  const [selectedBusiness, setSelectedBusiness] = useState(sampleBusinesses[0].id); // Default to the first business

  const handleBusinessChange = (e) => {
    setSelectedBusiness(e.target.value);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 text-[#4154f1] font-bold text-3xl mb-6">
        <FaFileAlt className="text-4xl" />
        <span>Generate New Bill</span>
      </div>

      {/* Dropdown for selecting a business */}
      <div className="mb-4">
        
        <div className="text-xl sm:pl-4 sm:text-2xl mt-2 font-medium mb-3">
         Select your Business
        </div>

        <select
          id="business-select"
          value={selectedBusiness}
          onChange={handleBusinessChange}
          className="border rounded-lg p-2 w-1/2 mb-4" // Added margin below the dropdown
        >
          {sampleBusinesses.map((business) => (
            <option key={business.id} value={business.id}>
              {business.name}
            </option>
          ))}
        </select>
      </div>

      {/* Bill Generation Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* GST Bills */}
        <div className="bg-white shadow-lg border rounded-3xl p-6 flex flex-col items-center justify-center text-center transform transition-all duration-300 hover:scale-105 cursor-pointer hover:shadow-2xl"
         onClick={() => navigate("/gst-invoice")}
        >
          <FaFileAlt className="text-5xl text-blue-600 mb-4" />
          <p className="text-lg font-semibold text-gray-800">Generate GST Bills</p>
        </div>

        {/* URD Bills */}
        <div className="bg-white shadow-lg border rounded-3xl p-6 flex flex-col items-center justify-center text-center transform transition-all duration-300 hover:scale-105 cursor-pointer hover:shadow-2xl"
        onClick={() => navigate("/invoice")}
        >
          <FaReceipt className="text-5xl text-blue-600 mb-4" />
          <p className="text-lg font-semibold text-gray-800">Generate URD Bills</p>
        </div>
      </div>
    </div>
  );
};

export default GenerateNewBill;
