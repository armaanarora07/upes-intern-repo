import React, { useEffect, useState } from 'react';
import {useDispatch,useSelector} from 'react-redux';
import {FaBriefcase, FaEdit, FaPlusCircle} from 'react-icons/fa';
import { useNavigate} from 'react-router-dom';
import {checkAndFetchBusinesses} from '../slices/businessSlice.js';

const BusinessCard = ({ id,user,gstin, legalName, tradeName,shippingAddress1,shippingAddress2,hsns}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedLegalName, setUpdatedLegalName] = useState(legalName);
  const [updatedTradeName, setUpdatedTradeName] = useState(tradeName);
  const navigate = useNavigate();

  const handleClick = () => {
     navigate(`/user-business?id=${id}&user=${user}&gstin=${gstin}&legalname=${legalName}&tradename=${tradeName}&shippingAddress1=${shippingAddress1}&shippingAddress2=${shippingAddress2}&hsns=${hsns}`);
  };

  return (
    <div onClick={handleClick} className="bg-white shadow-xl border rounded-3xl p-6 w-full h-auto transform transition-all duration-300 cursor-pointer hover:scale-105">
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
  //const [businesses, setBusinesses] = useState([]);
  //const [loading, setLoading] = useState(true);
  //const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    /*
    const fetchBusinesses = async () => {
      const authToken = localStorage.getItem('authToken');
      console.log(authToken);  // Debug to check token

      try {
        const response = await fetch('/user/myBusiness', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.data) {
          setBusinesses(data.data);
        } else {
          //setBusinesses([]);
        }
      } catch (error) {
       // setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    */
    dispatch(checkAndFetchBusinesses()); 
    //fetchBusinesses();
  }, [dispatch]);

  /*
  const handleSave = async (updatedBusiness) => {
    const authToken = localStorage.getItem('authToken');
    console.log('Sending updated business data:', updatedBusiness);  // Debug payload

    try {
      const response = await fetch('/user/business', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gstin: updatedBusiness.gstin,
          legal_name: updatedBusiness.legalName,
          trade_name: updatedBusiness.tradeName,
        }),
      });

      if (!response.ok) {
        console.error('Failed to update, status:', response.status);  // Log status
        throw new Error('Failed to update business');
      }

      const updatedData = businesses.map((business) =>
        business.gstin === updatedBusiness.gstin ? updatedBusiness : business
      );
     // setBusinesses(updatedData);
    } catch (error) {
      console.error('Error:', error);  // Log the error
      //setError(error.message);
    }
  };
  */

  return (
    <div className="p-6">

      <div className="flex items-center space-x-3 text-[#4154f1] font-bold text-3xl mb-6">
        <FaBriefcase className="text-4xl" />
        <span>My Business</span>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-8">
          {businesses.length > 0 ? (
            <>
              {businesses.map((business, index) => (
                <BusinessCard
                  key={index}
                  id = {business.user_id}
                  user={business.gst_username}
                  gstin={business.gstin}
                  legalName={business.legal_name}
                  tradeName={business.trade_name}
                  shippingAddress1={business.shipping_address.address1}
                  shippingAddress2={business.shipping_address.address2}
                  hsns={business.hsns}
                />
              ))}
              <div className="bg-white shadow-xl border rounded-3xl p-6 w-full h-auto transform transition-all duration-300 hover:scale-105 flex items-center justify-center cursor-pointer" onClick={() => navigate('/add-business')}>
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
