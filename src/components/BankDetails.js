import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addBankDetails, editBankDetails, SelectedBank} from '../slices/bankSlice';
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const BankDetails = () => {
  const dispatch = useDispatch();
  const { bankDetails } = useSelector((state) => state.banks);
  const [selectedBank, setSelectedBank] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [branchName, setBranchName] = useState('');
  const [bankName, setbankName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  const resetForm = () => {
    setAccountNumber('');
    setAccountHolderName('');
    setIfscCode('');
    setBranchName('');
    setbankName('');
    setEditingIndex(null);
  };

  const closeModal = () => {
    setActiveModal(null);
    resetForm();
  };

  const handleSelectBank = (bank) =>{
    setActiveModal('edit');
    setEditingIndex(bankDetails.indexOf(bank));
    setAccountNumber(bank.accountNumber);
    setAccountHolderName(bank.accountHolderName);
    setIfscCode(bank.ifscCode);
    setBranchName(bank.branchName);
    setbankName(bank.bankName);
  }

  const handleSelection = (bank) =>{
    setSelectedBank(bank);
    dispatch(SelectedBank(bank));
    closeModal();
  }

  const handleAddBankDetails = () => {
    dispatch(addBankDetails({ accountHolderName, accountNumber, ifscCode, branchName, bankName }));
    dispatch(SelectedBank({ accountHolderName, accountNumber, ifscCode, branchName, bankName }));
    setSelectedBank({ accountHolderName, accountNumber, ifscCode, branchName, bankName });
    closeModal();
  };

  const handleEditBankDetails = () => {
    dispatch(editBankDetails({ index: editingIndex, updatedBank: { accountHolderName, accountNumber, ifscCode, branchName, bankName } }));
    closeModal();
  };

  const handleRemoveBank = () => {
    if (selectedBank) {
      setSelectedBank(null);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl">
      <div className="mt-4 flex justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Bank Details</h2>
        <div className="flex space-x-3">
          <button onClick={() => setActiveModal('add')} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200">
            Add new Bank details
          </button>
          <button onClick={() => setActiveModal('select')} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200">
            Select Bank
          </button>
        </div>
      </div>
      
      {selectedBank ? (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold text-gray-700"><span className="font-semibold">{selectedBank.bankName}</span></h3>
          <p className="text-gray-600">Account Number : <span className="font-semibold">{selectedBank.accountNumber}</span></p>
          <p className="text-gray-600">Account Holder Name : <span className="font-semibold">{selectedBank.accountHolderName}</span></p>
          <p className="text-gray-600">IFSC Code : <span className="font-semibold">{selectedBank.ifscCode}</span></p>
          <p className="text-gray-600">Branch Name : <span className="font-semibold">{selectedBank.branchName}</span></p>
          <div className="flex space-x-2 mt-3">
            <button onClick={handleRemoveBank} className="btn btn-red">
              <FaTrash />
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 mt-2">No bank selected.</p>
      )}

      {/* Modal Component */}
      {activeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-semibold">{activeModal === 'add' ? 'Add Bank' : activeModal === 'edit' ? 'Edit Bank' : 'Select Bank'}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>

            {(activeModal === 'add' || activeModal === 'edit') && (
              <div className="mt-4 space-y-3">
                <div className="relative mb-4">
                    <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">Account Number</span>
                    <input
                        type="text"
                        className="w-full border border-[#4154f1] rounded-lg p-2"
                        value={accountNumber} // Update to the correct state variable
                        onChange={(e) => setAccountNumber(e.target.value)} 
                    />
                </div>
                <div className="relative mb-4">
                    <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">Account Holder Name</span>
                    <input
                        type="text"
                        className="w-full border border-[#4154f1] rounded-lg p-2"
                        value={accountHolderName} // Update to the correct state variable
                        onChange={(e) => setAccountHolderName(e.target.value)} 
                    />
                </div>
                <div className="relative mb-4">
                    <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">IFSC Code</span>
                    <input
                        type="text"
                        className="w-full border border-[#4154f1] rounded-lg p-2"
                        value={ifscCode} // Update to the correct state variable
                        onChange={(e) => setIfscCode(e.target.value)} 
                    />
                </div>
                <div className="relative mb-4">
                    <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">Branch Name</span>
                    <input
                        type="text"
                        className="w-full border border-[#4154f1] rounded-lg p-2"
                        value={branchName} // Update to the correct state variable
                        onChange={(e) => setBranchName(e.target.value)} 
                    />
                </div>
                <div className="relative mb-4">
                    <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">Bank Name</span>
                    <input
                        type="text"
                        className="w-full border border-[#4154f1] rounded-lg p-2"
                        value={bankName} // Update to the correct state variable
                        onChange={(e) => setbankName(e.target.value)} 
                    />
                </div>
                <button onClick={activeModal === 'add' ? handleAddBankDetails : handleEditBankDetails} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200 w-full">
                  {activeModal === 'add' ? 'Save' : 'Update'}
                </button>
              </div>
            )}

            {activeModal === 'select' && (
              <div className="mt-4">
                <input className="w-full border border-[#4154f1] rounded-lg p-2" type="text" placeholder="Search by Name" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <ul className="mt-2 space-y-2 max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-2">
                  {bankDetails.filter(bank => bank.accountHolderName.toLowerCase().includes(searchTerm.toLowerCase())).map((bank, index) => (
                    <li key={index} className="cursor-pointer p-2 rounded-lg bg-gray-100 hover:bg-gray-200 flex justify-between items-center">
                      <div onClick={() => { handleSelection(bank); }} className="flex-1">
                        {bank.bankName || ''} - {bank.accountNumber}
                      </div>
                      <div className="flex-end">
                        <button onClick={() => { handleSelectBank(bank); }} className="btn btn-yellow">
                          <FaEdit />
                        </button>
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
