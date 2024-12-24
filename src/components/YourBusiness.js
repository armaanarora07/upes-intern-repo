import React, { useEffect, useState } from 'react';
import Building from '../assets/building.png';
import edit from '../assets/edit.png';

const BusinessCard = ({ gstin, legalName, tradeName, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedLegalName, setUpdatedLegalName] = useState(legalName);
  const [updatedTradeName, setUpdatedTradeName] = useState(tradeName);

  const handleSave = () => {
    setIsEditing(false);
    onSave({ gstin, legalName: updatedLegalName, tradeName: updatedTradeName });
  };

  return (
    <div className="bg-blue-100 rounded-lg p-4 shadow-md">
      {isEditing ? (
        <div>
          <label><strong>GSTIN:</strong> {gstin}</label>
          <input
            type="text"
            value={updatedLegalName}
            onChange={(e) => setUpdatedLegalName(e.target.value)}
            className="border p-1 mt-2"
            placeholder="Legal Name"
          />
          <input
            type="text"
            value={updatedTradeName}
            onChange={(e) => setUpdatedTradeName(e.target.value)}
            className="border p-1 mt-2"
            placeholder="Trade Name"
          />
          <button onClick={handleSave} className="mt-2 bg-blue-500 text-white p-2 rounded">
            Save
          </button>
        </div>
      ) : (
        <div>
          <p><strong>GSTIN:</strong> {gstin}</p>
          <p><strong>Legal Name:</strong> {legalName}</p>
          <p><strong>Trade Name:</strong> {tradeName}</p>
          <div className="mt-2 flex justify-end">
            <button onClick={() => setIsEditing(true)} className="text-sm text-gray-500 flex items-center">
              <img src={edit} alt='edit icon' className='mr-1 w-4 mt-1' /> edit
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex p-3 rounded-xl bg-blue-100 text-4xl font-normal text-blue-600 items-center mb-6">
        <img src={Building} alt='building icon' className='mr-3 -mt-1 w-12' />
        Your Business
      </div>

      <div className="flex justify-between">
        <div>
          <p className="text-2xl font-normal mb-4">Hey, here are your businesses</p>
        </div>
        <div>
          <button className="bg-blue-100 text-blue-500 rounded-xl px-4 text-xl py-2 flex items-center">
            Add More Business <strong className="text-3xl ml-2 -mt-1">+</strong>
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-8">
          {businesses.length > 0 ? (
            businesses.map((business, index) => (
              <BusinessCard
                key={index}
                gstin={business.gstin}
                legalName={business.legal_name}
                tradeName={business.trade_name}
                onSave={handleSave}
              />
            ))
          ) : (
            <p>No businesses found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default YourBusiness;
