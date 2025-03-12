import React, { useEffect, useState } from 'react';
import {useDispatch,useSelector} from 'react-redux';
import {FaBriefcase, FaEdit, FaPlusCircle} from 'react-icons/fa';
import { useNavigate} from 'react-router-dom';
import {checkAndFetchBusinesses} from '../slices/businessSlice.js';
import { setTitle } from '../slices/navbarSlice.js';

const BusinessCard = ({ id,gstin, legalName, tradeName}) => {

  const navigate = useNavigate();

  const handleClick = () => {
     navigate(`/user-business?id=${id}`);
  };

  return (
    <div onClick={handleClick} className="p-6 mb-6 bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm w-full h-auto transform transition-all duration-300 cursor-pointer hover:scale-105">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold">GSTIN</span>
              <span className="text-gray-700">{gstin}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Legal Name</span>
              <span className="text-gray-700">{legalName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Trade Name</span>
              <span className="text-gray-700">{tradeName}</span>
            </div>
        </div>
    </div>
  );
};

const MyBusiness = () => {
  const dispatch = useDispatch();
  const { businesses, loading, error } = useSelector((state) => state.business);
  const navigate = useNavigate();

  useEffect(() => {

    dispatch(checkAndFetchBusinesses()); 
    const setNavTitle = () =>{
      dispatch(setTitle('My Business'));
    }

    setNavTitle();

  }, [setTitle,dispatch]);

  return (
    <div className="p-8">

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-5">
          {businesses.length > 0 ? (
            <>
              {businesses.map((business, index) => (
                <BusinessCard
                  key={index}
                  id = {business._id}
                  gstin={business.gstin}
                  legalName={business.legal_name}
                  tradeName={business.trade_name}
                />
              ))}
              <div className="p-6 mb-6 bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden w-full h-auto transform transition-all duration-300 hover:scale-105 flex items-center justify-center cursor-pointer" onClick={() => navigate('/add-business')}>
                <FaPlusCircle className="text-3xl mr-2" />
                <p className="text-xl font-semibold">Add More Business</p>
              </div>
            </>
          ) : (
            <p>No businesses found</p>
          )}
        </div>
      )}

    </div>
  );
};

export default MyBusiness;
