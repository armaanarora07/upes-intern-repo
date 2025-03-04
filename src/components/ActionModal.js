import React from 'react';
import { FaTimes } from 'react-icons/fa';

const ActionModal = ({ isOpen, onClose, onGenerateEway,onCreateNewBill, downloadUrl, onDownloadbill, invoiceType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 min-h-[300px] relative">
        <h2 className="font-semibold text-lg mb-4 text-center">Choose an Action</h2>
        <div className="flex flex-col mb-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-2 transition duration-200 hover:bg-blue-600 shadow-md"
            onClick={onDownloadbill}
          >
            Download Bill
          </button>
          {invoiceType==='gstinvoice' && 
          (
           <>
            <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-2 transition duration-200 hover:bg-blue-600 shadow-md"
            onClick={onGenerateEway}
            >
            Generate E-way
            </button>
          </>
          )
          }
          <h1 className="text-center my-2">OR</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-2 transition duration-200 hover:bg-blue-600 shadow-md"
            onClick={onCreateNewBill}
          >
            Create New Bill
          </button>
        </div>
        <button
          className="absolute top-4 right-4 text-gray-600 transition-transform duration-300 ease-in-out transform hover:rotate-90"
          onClick={onClose}
        >
          <FaTimes className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default ActionModal; 