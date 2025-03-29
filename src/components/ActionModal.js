import React from 'react';
import { FaTimes } from 'react-icons/fa';

const ActionModal = ({ isOpen, onClose, onGenerateEway,onCreateNewBill, downloadUrl, onDownloadbill, invoiceType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
      <div className="bg-white p-6 border rounded-lg shadow-xl border-gray-200 overflow-hidden w-1/3 min-h-[300px] relative dark:bg-gray-800 dark:border-gray-700">
        <h2 className="font-semibold text-lg mb-4 text-center dark:text-gray-200">Choose an Action</h2>
        <div className="flex flex-col mb-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-2 transition duration-200 hover:bg-blue-600 shadow-md dark:bg-blue-800 dark:text-gray-200 dark:hover:bg-blue-700 dark:border-blue-800"
            onClick={onDownloadbill}
          >
            Download Bill
          </button>
          {invoiceType==='gstinvoice' && 
          (
           <>
            <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-2 transition duration-200 hover:bg-blue-600 shadow-md dark:bg-blue-800 dark:text-gray-200 dark:hover:bg-blue-700 dark:border-blue-800"
            onClick={onGenerateEway}
            >
            Generate E-way
            </button>
          </>
          )
          }
          <h1 className="text-center my-2 dark:text-gray-200">OR</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-2 transition duration-200 hover:bg-blue-600 shadow-md dark:bg-blue-800 dark:text-gray-200 dark:hover:bg-blue-700 dark:border-blue-800"
            onClick={onCreateNewBill}
          >
            Create New Bill
          </button>
        </div>
        <button
          className="absolute top-4 right-4 text-gray-600 transition-transform duration-300 ease-in-out transform hover:rotate-90 dark:text-gray-200"
          onClick={onClose}
        >
          <FaTimes className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default ActionModal; 