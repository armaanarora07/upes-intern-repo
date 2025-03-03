import React, { useState,useEffect } from "react";
import {FaReceipt, FaFileAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTitle } from "../slices/navbarSlice";


const GenerateNewBill = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(()=>{
    
    const setNavTitle = () =>{
      dispatch(setTitle('Generate New Bill'));
    }

    setNavTitle();
  },[setTitle,dispatch])


  return (
    <div className="p-8 mt-10">

      {/* Bill Generation Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-5">

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
