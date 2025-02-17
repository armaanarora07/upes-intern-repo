import React, { useEffect, useState } from 'react';
import {FaBriefcase, FaEdit, FaPlusCircle} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BusinessCard = ({ gstin, legalName, tradeName, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedLegalName, setUpdatedLegalName] = useState(legalName);
  const [updatedTradeName, setUpdatedTradeName] = useState(tradeName);
  

  const handleSave = () => {
    setIsEditing(false);
    onSave({ gstin, legalName: updatedLegalName, tradeName: updatedTradeName });
  };

  return (
    <div className="bg-white shadow-xl border rounded-3xl p-6 w-full h-auto transform transition-all duration-300 hover:scale-105">
      {isEditing ? (
        <div className="flex flex-col">
          <label className="font-semibold mb-1">GSTIN - <span className="text-gray-700">{gstin}</span></label>
          <input
            type="text"
            value={updatedLegalName}
            onChange={(e) => setUpdatedLegalName(e.target.value)}
            className="border p-2 mt-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Legal Name"
          />
          <input
            type="text"
            value={updatedTradeName}
            onChange={(e) => setUpdatedTradeName(e.target.value)}
            className="border p-2 mt-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Trade Name"
          />
          <div className="flex justify-between mt-4">
            <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200 w-1/2 mr-1">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-400 transition duration-200 w-1/2 ml-1">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
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
          <div className="mt-2 flex justify-end">
            <button onClick={() => setIsEditing(true)} className="text-sm text-gray-500 flex items-center">
              <FaEdit className='mr-1 w-4 mt-1' /> Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const YourBusiness = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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
          setBusinesses([]);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

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
      setBusinesses(updatedData);
    } catch (error) {
      console.error('Error:', error);  // Log the error
      setError(error.message);
    }
  };

  return (
    <div className="p-6">

      <div className="flex items-center space-x-3 text-[#4154f1] font-bold text-3xl mb-6">
        <FaBriefcase className="text-4xl" />
        <span>Your Business</span>
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
                  gstin={business.gstin}
                  legalName={business.legal_name}
                  tradeName={business.trade_name}
                  onSave={handleSave}
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

export default YourBusiness;
