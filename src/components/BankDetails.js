import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearSelectedBank, fetchBanks, SelectedBank, setEnabled} from '../slices/bankSlice';
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { Trash2 } from 'lucide-react';
import axios from 'axios';

const bankNames = [
  // Public Sector Banks (PSBs)
  "State Bank of India",
  "Punjab National Bank",
  "Bank of Baroda",
  "Canara Bank",
  "Union Bank of India",
  "Bank of India",
  "Indian Bank",
  "Central Bank of India",
  "Indian Overseas Bank",
  "UCO Bank",
  "Bank of Maharashtra",
  "Punjab & Sind Bank",

  // Private Sector Banks
  "HDFC Bank",
  "ICICI Bank",
  "Kotak Mahindra Bank",
  "Axis Bank",
  "IndusInd Bank",
  "Yes Bank",
  "IDFC First Bank",
  "Federal Bank",
  "RBL Bank",
  "South Indian Bank",
  "Bandhan Bank",
  "City Union Bank",
  "Karur Vysya Bank",
  "Tamilnad Mercantile Bank",
  "DCB Bank",
  "Karnataka Bank",
  "Dhanlaxmi Bank",
  "Jammu & Kashmir Bank",
  "Nainital Bank",
  "CSB Bank",

  // Small Finance Banks (SFBs)
  "AU Small Finance Bank",
  "Equitas Small Finance Bank",
  "Ujjivan Small Finance Bank",
  "Jana Small Finance Bank",
  "Suryoday Small Finance Bank",
  "Capital Small Finance Bank",
  "ESAF Small Finance Bank",
  "Fincare Small Finance Bank",
  "North East Small Finance Bank",
  "Shivalik Small Finance Bank",
  "Unity Small Finance Bank",
  "Utkarsh Small Finance Bank",

  // Payments Banks
  "Airtel Payments Bank",
  "India Post Payments Bank",
  "Fino Payments Bank",
  "Jio Payments Bank",
  "NSDL Payments Bank",
  "Paytm Payments Bank",

  // Local Area Banks
  "Coastal Local Area Bank Ltd",
  "Krishna Bhima Samruddhi Local Area Bank Ltd"
];

const BankDetails = () => {
  const dispatch = useDispatch();
  const { bankDetails, selectedGBank, enabled } = useSelector((state) => state.banks);
  const authToken = useSelector((state) => state.auth.authToken);
  const [selectedBank, setSelectedBank] = useState(selectedGBank);
  const [activeModal, setActiveModal] = useState(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bankName, setbankName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [errors, setErrors] = useState({}); //  new line added by armaan

  const resetForm = () => {
    setAccountNumber('');
    setUpiId('');
    setIfscCode('');
    setbankName('');
    setEditingIndex(null);
  };

  const closeModal = () => {
    setActiveModal(null);
    resetForm();
  };

  useEffect(()=>{
    dispatch(fetchBanks());
  },[dispatch]);


  const handleSelection = (bank) =>{
    setSelectedBank(bank);
    dispatch(SelectedBank(bank));
    closeModal();
  }

  // const handleAddBankDetails = async () => {

  //   const reqBody = {
  //     ac_no: accountNumber,
  //     ifsc: ifscCode,
  //     bank_name: bankName,
  //     upi_id: upiId
  //   }

const handleAddBankDetails = async () => {
    const newErrors = {};

    // Bank Name: Should only contain letters and spaces.
    if (!bankName.trim()) {
      newErrors.bankName = 'Bank name is required.';
    } else if (!/^[a-zA-Z\s]+$/.test(bankName)) {
      newErrors.bankName = 'Bank name can only contain letters and spaces.';
    }

    // Account Number: Should be numeric and between 9-18 digits.
    if (!accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required.';
    } else if (!/^\d{9,18}$/.test(accountNumber)) {
      newErrors.accountNumber = 'Enter a valid account number (9-18 digits).';
    }

    // IFSC Code: Should be 11 characters, first 4 alphabetic, 5th is 0, last 6 alphanumeric.
    if (!ifscCode.trim()) {
      newErrors.ifscCode = 'IFSC code is required.';
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
      newErrors.ifscCode = 'Enter a valid 11-character IFSC code.';
    }
    
    // UPI ID: Should follow a standard format like username@handle.
    if (upiId && !/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiId)) {
        newErrors.upiId = 'Enter a valid UPI ID (e.g., yourname@bank).';
    }


    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return; // Stop if there are errors
    }

    const reqBody = {
      ac_no: accountNumber,
      ifsc: ifscCode,
      bank_name: bankName,
      upi_id: upiId
    }

   try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/bank`,
         reqBody,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }
    dispatch(SelectedBank({ accountNumber, ifscCode,upiId, bankName }));
    setSelectedBank({ accountNumber, ifscCode,upiId, bankName });
    dispatch(fetchBanks());
    closeModal();
  };

  const handleRemoveBank = () => {
    if (selectedBank) {
      setSelectedBank(null);
      dispatch(clearSelectedBank());
    }
  };

  const handleToggle = () => {
     dispatch(setEnabled());
  };

const [filteredBanks, setFilteredBanks] = useState([]);

const handleBankNameChange = (e) => {
  const value = e.target.value;
  setbankName(value);
  
  // Filter the list based on input
  if (value.length > 0) {
    setFilteredBanks(bankNames.filter(bank => bank.toLowerCase().includes(value.toLowerCase())));
  } else {
    setFilteredBanks([]);
  }
};

const selectBank = (name) => {
  setbankName(name);
  setFilteredBanks([]);
};


  return (
    <div className="p-6 mt-5 mb-6 bg-white border dark:bg-gray-800 dark:border-gray-700 rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="mt-4 flex justify-between">

        <div className='flex space-x-3'>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Bank Details</h2>
        <label className="flex items-center cursor-pointer">
          <input type="checkbox" className="hidden" checked={enabled} onChange={handleToggle} />
          <div 
            className="w-12 h-6 flex items-center rounded-full p-1 transition dark:bg-gray-800 dark:border-gray-700" 
            style={{ backgroundColor: enabled ? '#3B82F6' : '#6B7280' }} // Blue when enabled, Gray when disabled
          >
            <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition dark:bg-gray-800 dark:border-gray-700 ${enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </div>
        </label>
        </div>

        <div className="flex space-x-3">
          <button onClick={() => setActiveModal('add')} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200 dark:bg-blue-800 dark:text-gray-200 dark:hover:bg-blue-700">
            Add new Bank details
          </button>
          <button onClick={() => setActiveModal('select')} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200 dark:bg-blue-800 dark:text-gray-200 dark:hover:bg-blue-700">
            Select Bank
          </button>
        </div>

      </div>
      
      {selectedBank ? (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg dark:bg-gray-600 dark:border-gray-700">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200"><span className="font-semibold">{selectedBank.bankName}</span></h3>
          <p className="text-gray-600 dark:text-gray-200">Account Number : <span className="font-semibold">{selectedBank.accountNumber}</span></p>
          <p className="text-gray-600 dark:text-gray-200">IFSC Code : <span className="font-semibold">{selectedBank.ifscCode}</span></p>
          <p className="text-gray-600 dark:text-gray-200">UPI ID : <span className="font-semibold">{selectedBank.upiId}</span></p>
          <div className="flex space-x-2 mt-3">
            <button onClick={handleRemoveBank} className="btn btn-red dark:text-gray-200">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 mt-2">No bank selected.</p>
      )}

      {/* Modal Component */}
      {activeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-semibold dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">{activeModal === 'add' ? 'Add Bank' : activeModal === 'edit' ? 'Edit Bank' : 'Select Bank'}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>

            {(activeModal === 'add') && (
              <div className="mt-4 space-y-4 dark:bg-gray-800">
                {/* // replaced */}
                  {/* <div className="relative mb-4">
                    <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black dark:bg-gray-800 dark:text-white">Bank Name</span>
                    <input
                      type="text"
                      className="w-full border border-[#4154f1] rounded-lg p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
                      value={bankName}
                      onChange={handleBankNameChange}
                    />
                    {filteredBanks.length > 0 && (
                      <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-lg shadow-md">
                        {filteredBanks.map((bank, index) => (
                          <li
                            key={index}
                            className="p-2 hover:bg-gray-200 cursor-pointer dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
                            onClick={() => selectBank(bank)}
                          >
                            {bank}
                          </li>
                        ))}
                      </ul>
                     )}
                </div>
                <div className="relative mb-4">
                    <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black dark:bg-gray-800 dark:text-white">Account Number</span>
                    <input
                        type="text"
                        className="w-full border border-[#4154f1] rounded-lg p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
                        value={accountNumber} // Update to the correct state variable
                        onChange={(e) => setAccountNumber(e.target.value)} 
                    />
                </div>
                <div className="relative mb-4">
                    <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black dark:bg-gray-800 dark:text-white">IFSC Code</span>
                    <input
                        type="text"
                        className="w-full border border-[#4154f1] rounded-lg p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
                        value={ifscCode} // Update to the correct state variable
                        onChange={(e) => setIfscCode(e.target.value)} 
                    />
                </div> */}
                {/* //replaced */}
              {/* //This new block, includes inline validation logic and displays error messages - by armaan */}
                <div className="relative mb-4">
                    <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black dark:bg-gray-800 dark:text-white">Bank Name</span>
                    {/* <input
                      type="text"
                      className="w-full border border-[#4154f1] rounded-lg p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
                      value={bankName}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[0-9]/g, ''); // Remove numbers
                        setbankName(value);
                        handleBankNameChange(e);
                      }}
                    /> */}
                      {/* //This updated version, which now only allows letters and spaces - by armaan */}
                    <input
                      type="text"
                      className="w-full border border-[#4154f1] rounded-lg p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
                      value={bankName}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Allow only letters and spaces
                        setbankName(value);
                        handleBankNameChange({ target: { value } }); // Pass the sanitized value to the handler
                      }}
                    />
                    {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>}
                    {filteredBanks.length > 0 && (
                      <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-lg shadow-md">
                        {filteredBanks.map((bank, index) => (
                          <li
                            key={index}
                            className="p-2 hover:bg-gray-200 cursor-pointer dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
                            onClick={() => selectBank(bank)}
                          >
                            {bank}
                          </li>
                        ))}
                      </ul>
                     )}
                </div>
                <div className="relative mb-4">
                    <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black dark:bg-gray-800 dark:text-white">Account Number</span>
                    <input
                        type="text"
                        className="w-full border border-[#4154f1] rounded-lg p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
                        value={accountNumber}
                        maxLength={18}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
                          setAccountNumber(value);
                        }}
                    />
                    {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>}
                </div>
                <div className="relative mb-4">
                    <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black dark:bg-gray-800 dark:text-white">IFSC Code</span>
                    <input
                        type="text"
                        className="w-full border border-[#4154f1] rounded-lg p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
                        value={ifscCode}
                        maxLength={11}
                        onChange={(e) => {
                          const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); // Allow only uppercase letters and numbers
                          setIfscCode(value);
                        }}
                    />
                    {errors.ifscCode && <p className="text-red-500 text-xs mt-1">{errors.ifscCode}</p>}
                </div>

                <div className="relative mb-4">
                    <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black dark:bg-gray-800 dark:text-white">UPI ID</span>
                    <input
                        type="text"
                        className="w-full border border-[#4154f1] rounded-lg p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
                        value={upiId} // Update to the correct state variable
                        onChange={(e) => setUpiId(e.target.value)} 
                    />
                    {/* This line adds the error message display */}
                    {errors.upiId && <p className="text-red-500 text-xs mt-1">{errors.upiId}</p>}
                </div>
                <button onClick={ handleAddBankDetails } className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200 w-full dark:bg-blue-800 dark:text-blue-200 dark:hover:bg-blue-700">
                   Save
                </button>
              </div>
            )}

            {activeModal === 'select' && (
              <div className="mt-4">
                <input className="w-full border border-[#4154f1] rounded-lg p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4154f1]" type="text" placeholder="Search by Account Number" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <ul className="mt-2 space-y-2 max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-2 dark:border-gray-600 dark:bg-gray-800">
                  {bankDetails.filter(bank => bank.accountNumber.includes(searchTerm.toLowerCase())).map((bank, index) => (
                    <li key={index} className="cursor-pointer p-2 rounded-lg bg-gray-100 hover:bg-gray-200 flex justify-between items-center dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200">
                      <div onClick={() => { handleSelection(bank); }} className="flex-1">
                        {bank.bankName || ''} - {bank.accountNumber}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BankDetails;