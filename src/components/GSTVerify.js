import React, { useState, useEffect } from "react";
import TopAlert from "./TopAlert";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setGSTDetails, setGSTError } from '../slices/gstSlice';
import { setTradeName, setPhoneNo, updatePrimaryAddress , toggleShippingSameAsPrimary, setInvoiceNo} from '../slices/userdetailsSlice';
import axios from 'axios';

const GSTVerify = ({ gstNumber, isRequired }) => {
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.authToken);
  const gstDetails = useSelector((state) => state.gst.gstDetails);
  const verification = useSelector((state)=> state.gst.isVerified);
  const verifiedStatus = useSelector((state)=> state.gst.status);
  const [GST, setGST] = useState(gstDetails ? gstDetails.gstin : '');
  const [status, setStatus] = useState(verifiedStatus);
  const [isVerified, setIsVerified] = useState(verification);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const handleOpenAlert = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    setAlertType('');
    setAlertMessage('');
  };

  const clearUserDetails = () =>{
    dispatch(setTradeName(''));
    dispatch(updatePrimaryAddress({ 'address1': ''}));
    dispatch(updatePrimaryAddress({ 'pincode':  '' }));
    dispatch(updatePrimaryAddress({ 'state': ''}));
    dispatch(setPhoneNo(''));
    dispatch(setInvoiceNo(''));
    dispatch(toggleShippingSameAsPrimary());
    setIsVerified(false);
  }

  const formatGSTNumber = (gst) => {
    return gst.toUpperCase().trim();
  };

  useEffect(() => {
    if (gstNumber && gstNumber.length === 15) {
      setGST(gstNumber);
      handleVerify(gstNumber);
    }
  }, []);

  const handleVerify = async (gstNumber) => {
    if (!gstNumber) {
      handleOpenAlert('error', 'Enter a Valid GST Number');
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/validategst?gst=${gstNumber}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.statusText === 'OK') {
        // Store the GST details in Redux
        dispatch(setGSTDetails({
          gstin: response.data.data.gstin,
          legalName: response.data.data.legal_name,
          tradeName: response.data.data.trade_name,
          principalAddress: response.data.data.principal_address,
          shippingAddress: response.data.data.shipping_address,
          igst: response.data.data.igst
        }));
        dispatch(setTradeName(response.data.data.trade_name));
        dispatch(updatePrimaryAddress({ 'address1': response.data.data.principal_address.address1}));
        dispatch(updatePrimaryAddress({ 'pincode':  response.data.data.principal_address.pincode }));
        dispatch(updatePrimaryAddress({ 'state':  response.data.data.principal_address.state }));
        setIsVerified(true);
        setStatus(true);
      } else {
        dispatch(setGSTError('Verification failed'));
        handleOpenAlert('error', 'Verification failed');
        setStatus(true);
        clearUserDetails();
      }
    } catch (error) {
      dispatch(setGSTError(error.message));
      handleOpenAlert('error', 'Verification failed');
      setStatus(true);
      clearUserDetails();
    }
  };

  return (
    <div className='p-6 mt-5 mb-6 bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden'>
      <h2 className="text-2xl font-bold text-gray-800">GSTIN</h2>
      <div className="w-2/5 relative">
      <div className="relative mb-3 mt-4">
        <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
          GSTIN
        </span>
        <input
          type="text"
          value={GST}
          onChange={(e) => {
            const formattedGST = formatGSTNumber(e.target.value);
            setGST(formattedGST);
            
            if (formattedGST.length === 15) {
              handleVerify(formattedGST);
            }
          }}
          className="w-full border border-[#4154f1] rounded-lg p-2"
          required={isRequired}
        />
        {status && (isVerified ? (
          <span className="absolute right-2 top-2 text-green-500">
            <FaCheckCircle />
          </span>
        ) : (
          <span className="absolute right-2 top-2 text-red-500">
            <FaTimesCircle />
          </span>
        ))}
        {isRequired && !GST && (
            <span className="text-red-500 text-xs mt-1">GSTIN is required</span>
         )}
      </div>
      </div>

      {showAlert && (
        <TopAlert
          type={alertType}
          message={alertMessage}
          onClose={handleCloseAlert}
        />
      )}
    </div>
  );
};

export default GSTVerify;