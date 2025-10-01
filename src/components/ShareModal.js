import React from 'react';

// Minimal ShareModal kept as a fallback UI in case other modules import it.
// Primary sharing should use the device-native share handled in `GenerateInvoice`.
const ShareModal = ({ isOpen, onClose, previewUrl, billId }) => {
  if (!isOpen) return null;

  const publicUrl = billId ? `${window.location.origin}/public-invoice/${billId}` : previewUrl || window.location.href;

  const handleCopy = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(publicUrl);
      alert('Link copied to clipboard');
    } else {
      window.prompt('Copy this link', publicUrl);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Share Invoice</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-300 text-2xl leading-none">×</button>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">Use your device's native share option (preferred) or copy the link below.</p>

        <div className="flex space-x-2">
          <input readOnly value={publicUrl} className="flex-1 px-3 py-2 border rounded" />
          <button onClick={handleCopy} className="px-3 py-2 bg-blue-500 text-white rounded">Copy</button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;