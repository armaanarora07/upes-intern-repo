import React, { useEffect, useState } from 'react';

// Props: isOpen, onClose, onGenerateEway, onCreateNewBill, onDownloadbill, onShareInvoice, invoiceType, billId
const ActionModal = ({
  isOpen,
  onClose,
  onGenerateEway,
  onCreateNewBill,
  onDownloadbill,
  onShareInvoice,
  onExportWord,
  onExportImage,
  invoiceType,
  billId,
  // debug helper: set to true temporarily to always show Share button during troubleshooting
  forceShowShare = false,
}) => {
  // hooks must run unconditionally
  const [animateIn, setAnimateIn] = useState(false);
  const [showExportPopover, setShowExportPopover] = useState(false);
  useEffect(() => {
    let t;
    if (isOpen) {
      // trigger entrance animation when modal opens
      t = setTimeout(() => setAnimateIn(true), 10);
    } else {
      setAnimateIn(false);
      setShowExportPopover(false);
    }
    return () => clearTimeout(t);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
      data-testid="action-modal-backdrop"
    >
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 ${animateIn ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-6 scale-95'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Choose an Action</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-2xl leading-none"
            aria-label="close-action-modal"
          >
            ×
          </button>
        </div>

        <div className="space-y-3">
          <button
            onClick={onDownloadbill}
            className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
          >
            Download Bill
          </button>

          {/* Share Invoice Button - always shown now. Calls parent's share handler then closes modal. */}
              <button
                onClick={async () => { if (onShareInvoice) await onShareInvoice(); if (onClose) onClose(); }}
                className="w-full flex items-center justify-center p-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors font-medium shadow-md"
                data-testid="share-invoice-button"
              >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
              </svg>
              Share Invoice
              </button>

              {/* small description under Share button */}
              <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">via WhatsApp, SMS, Email, and other apps</p>

          <div className="text-center text-gray-500 dark:text-gray-400 font-medium">OR</div>

          {/* Export Invoice As - a button that toggles a right-side popover */}
          <div className="w-full">
            <div className="relative flex items-start">
              <button
                onClick={() => setShowExportPopover((s) => !s)}
                className="w-full p-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors font-medium"
              >
                Export Invoice As
              </button>

              <div
                className={`absolute top-0 left-full ml-3 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg p-3 transform transition-all duration-200 ${showExportPopover ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 -translate-x-2 pointer-events-none'}`}
                style={{ zIndex: 60 }}
              >
                <div className="text-sm text-gray-700 dark:text-gray-200 mb-2">Choose export format</div>
                <button
                  onClick={() => { /* temporarily disabled - conversion requires server-side support */ setShowExportPopover(false); alert('Export to Word is temporarily disabled. We will enable this soon.'); }}
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Microsoft Word (.docx)
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => { setShowExportPopover(false); alert('Export to Image is temporarily disabled. We will enable this soon.'); }}
                    className="flex-1 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                  >
                    Image (PNG)
                  </button>
                  <button
                    onClick={() => { setShowExportPopover(false); alert('Export to Image is temporarily disabled. We will enable this soon.'); }}
                    className="flex-1 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                  >
                    Image (JPG)
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onCreateNewBill}
            className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
          >
            Create New Bill
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;