import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaTimes } from 'react-icons/fa';
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { clearGSTDetails } from "../slices/gstSlice";
import { clearProducts } from "../slices/productSlice";
import { clearUserDetails } from "../slices/userdetailsSlice";
import { setTitle } from "../slices/navbarSlice";
import BillPreview from "./BillPreview";
import BackButton from './BackButton';

const EWayBillRequest = () => {
  const [preview,setPreview] = useState(false);
  const [vehicleNo, setVehicleNo] = useState("");
  const [billDocId, setBillDocId] = useState("");
  const [TransporterId, setTransporterId] = useState("");
  const [docNo, setDocNo] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const authToken = useSelector((state) => state.auth.authToken);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTitle("Generate E-Way Bill"));
  }, [dispatch]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.size > 0) {
      setBillDocId(queryParams.get("billid"));
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    const requestData = {
      vehicle_no: vehicleNo,
      transported_id: TransporterId,
      transporter_name: "",
      bill_doc_id: billDocId,
      doc_no: docNo,
    };

    try {
      const result = await axios.post(`${process.env.REACT_APP_API_URL}/user/eway`, requestData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      setResponse(result.data);
      setShowModal(true); // Show modal on success
    } catch (error) {
      setError(error.response?.data || "Error occurred");
      setShowModal(true); // Show modal on error
    } finally {
      setLoading(false);
    }
  };

  const onDownloadBill = () => {
    window.open(response.url, "_blank");
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
    setResponse(null);
    setBillDocId('');
    setTransporterId('');
    setVehicleNo('');
    setDocNo('');
    setError(null);
    dispatch(clearGSTDetails());
    dispatch(clearProducts());
    dispatch(clearUserDetails());
  };

  const onAddToGST = () => {
    setPreview(true);
  };

  return (
    <div className="p-8 min-h-screen dark:bg-gray-800">
      {/* Back Button */}
      <BackButton to="/eway-transactions" destination="E-Way Transactions" />
      
      <div className="mt-5">
        <div className="flex flex-col items-center justify-center">
          <div className="p-6 mt-5 mb-6 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 flex justify-center dark:text-gray-200">Request E-Way Bill</h2>

          <form onSubmit={handleSubmit} className="w-96 mb-5">
            <label className="block mb-2 dark:text-gray-200">
              Transporter Id
              <input
                type="text"
                value={TransporterId}
                onChange={(e) => setTransporterId(e.target.value)}
                className="w-full p-2 border rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
              />
            </label>
            <h3 className="text-center my-2 dark:text-gray-200">OR</h3>
            <label className="block mb-2 dark:text-gray-200">
              Vehicle No
              <input
                type="text"
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value)}
                className="w-full p-2 border rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
              />
            </label>

            <label className="block mb-4 dark:text-gray-200">
              Document No
              <input
                type="text"
                value={docNo}
                onChange={(e) => setDocNo(e.target.value)}
                className="w-full p-2 border rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
              />
            </label>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 dark:bg-blue-800 dark:text-gray-200 dark:hover:bg-blue-700 dark:border-blue-800"
              disabled={loading}
            >
              {loading ? "Sending..." : "Submit Request"}
            </button>
          </form>
          </div>
        </div>
      </div>

      {/* Modal for Response or Error */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center w-1/3 min-h-[300px] relative dark:bg-gray-800 dark:border-gray-700">
            {response ? (
              <>
                <h3 className="text-xl font-semibold mb-4 dark:text-gray-200">E-Way Bill Generated Successfully!</h3>
                <p className="dark:text-gray-200"><strong>E-Way No:</strong> {response.eway_no}</p>
                <p className="dark:text-gray-200"><strong>Vehicle No:</strong> {response.vehicle_no}</p>
                <div className="mt-4 flex flex-col gap-3">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:bg-blue-800 dark:text-gray-200 dark:hover:bg-blue-700 dark:border-blue-800"
                    onClick={onDownloadBill}
                  >
                    View E-Way Bill
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:bg-blue-800 dark:text-gray-200 dark:hover:bg-blue-700 dark:border-blue-800"
                    onClick={onAddToGST}
                  >
                    Add E-Way to GST Bill
                  </button>
                  <button
                    className="absolute top-4 right-4 text-gray-600 transition-transform duration-300 ease-in-out transform hover:rotate-90"
                    onClick={closeModal}
                  >
                      <FaTimes className="h-6 w-6" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-4 text-red-600">Error Occurred</h3>
                <p>{error}</p>
                <button
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  onClick={closeModal}
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <BillPreview
         open={preview} 
         onClose={() => setPreview(false)} 
         ewaybillData={response} 
      />

    </div>
  );
};

export default EWayBillRequest;
