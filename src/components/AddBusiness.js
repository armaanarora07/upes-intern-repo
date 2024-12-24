import React, { useState } from 'react';
import { FaBusinessTime } from 'react-icons/fa';

const AddBusiness = () => {
  const [gstin, setGstin] = useState('');
  const [legalName, setLegalName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [legalAddress, setLegalAddress] = useState('');
  const [hsnCode, setHsnCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const authToken = localStorage.getItem('authToken');

  const handleGstinChange = (e) => {
    setGstin(e.target.value);
  };

  const handleVerify = async () => {
    try {
      const response = await fetch(`https://fyntl.sangrahinnovations.com/user/validategst?gst=${gstin}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      // Log the entire response object for structure
      console.log('Complete Response:', response);
      console.log('Parsed API Response:', data);

      if (response.ok) {
        // Adjusted for possible nested structure
        console.log('Legal Name:', data.data?.legal_name);
        console.log('Trade Name:', data.data?.trade_name);
        console.log('Shipping Address:', data.data?.shipping_address.address1);
        console.log('Legal Address:', data.data?.principal_address.address1);
        console.log('HSN Code:', data.data?.hsn_code);

        setLegalName(data.data?.legal_name || '');
        setTradeName(data.data?.trade_name || '');
        setShippingAddress(data.data?.shipping_address.address1 || '');
        setLegalAddress(data.data?.principal_address.address1 || '');
        setHsnCode(data.data?.hsn_code || '');
        setIsVerified(true);
      } else {
        console.error('Verification failed:', data);
        console.error('Status:', response.status);
        console.error('Status Text:', response.statusText);
      }
    } catch (error) {
      console.error('Error during verification:', error);
    }
  };

  return (
    <div className='p-2 pl-2 sm:pl-4'>
      <div className='bg-blue-200 text-blue-600 text-xl sm:text-3xl font-semibold rounded-lg p-4 flex items-center'>
        <FaBusinessTime className="text-gray-500 mr-4" /> 
        Add Business
      </div>

      <div className="grid grid-cols-3 gap-4 mt-2">
        <div className="col-span-2 text-xl sm:text-3xl font-semibold">Enter your Business Details: </div>
        <div className="p-2 sm:p-4 col-span-1 bg-blue-200 text-blue-600 text-sm sm:text-2xl font-semibold rounded-lg">Add Another Business + </div>
      </div>

      <input
        type="text"
        placeholder="GSTIN NUMBER *"
        className="border bg-gray-100 border-gray-200 p-2 rounded-lg w-1/3 shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
        value={gstin}
        onChange={handleGstinChange}
        required
      /><br/>

      <button
        className={`p-2 rounded-md mt-2 ${isVerified ? 'bg-green-500' : 'bg-blue-500'} text-white hover:${isVerified ? 'bg-green-600' : 'bg-blue-600'}`}
        onClick={isVerified ? null : handleVerify}
      >
        {isVerified ? 'Verified' : 'Verify'}
      </button><br/>

      <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 mt-2">
        Add Business
      </button>

      <div className="grid grid-cols-2 gap-6 w-full sm:w-2/3 mt-8">
        <input
          type="text"
          placeholder="Trade Name"
          className="p-2 border border-gray-100 rounded-md bg-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
          value={tradeName}
          onChange={(e) => setTradeName(e.target.value)} 
        />
        <input
          type="text"
          placeholder="Legal Name"
          className="p-2 border border-gray-100 rounded-md bg-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
          value={legalName}
          onChange={(e) => setLegalName(e.target.value)} 
        />
        <input
          type="text"
          placeholder="Shipping Address"
          className="p-2 border border-gray-100 rounded-md bg-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)} 
        />
        <input
          type="text"
          placeholder="Legal Address"
          className="p-2 border border-gray-100 rounded-md bg-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
          value={legalAddress}
          onChange={(e) => setLegalAddress(e.target.value)} 
        />
        <input
          type="text"
          placeholder="HSN Code"
          className="col-span-1 p-2 border border-gray-100 rounded-md bg-gray-100 text-left shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
          value={hsnCode}
          onChange={(e) => setHsnCode(e.target.value)} 
        />
      </div>
    </div>
  );
}

export default AddBusiness;
