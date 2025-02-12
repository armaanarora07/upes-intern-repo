import React, { useState } from "react";
import axios from "axios";

const EWayBillRequest = () => {
  const [vehicleNo, setVehicleNo] = useState("");
  const [billDocId, setBillDocId] = useState("");
  const [docNo, setDocNo] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('authToken');


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const requestData = {
        vehicle_no: vehicleNo,
        transported_id: null,  
        transporter_name: null, 
        bill_doc_id: billDocId,
        doc_no: docNo,
      };

    try {
      const result = await axios.post(
        "https://fyntl.sangrahinnovations.com/user/eway?_id=679b267ee04f7accf7964175",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,

            "Content-Type": "application/json",
          },
        }
      );

      setResponse(result.data);
    } catch (error) {
      setResponse(error.response?.data || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-xl font-bold mb-4">E-Way Bill Request</h2>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
        <label className="block mb-2">
          Vehicle No:
          <input
            type="text"
            value={vehicleNo}
            onChange={(e) => setVehicleNo(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block mb-2">
          Transporter Id
          <input
            type="text"
            value={billDocId}
            onChange={(e) => setBillDocId(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </label>
        
        

        <label className="block mb-4">
          Document No:
          <input
            type="text"
            value={docNo}
            onChange={(e) => setDocNo(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Sending..." : "Submit Request"}
        </button>
      </form>

      {response && (
        <div className="mt-6 bg-white p-4 rounded shadow-md w-96">
          <h3 className="font-semibold">Response:</h3>
          <pre className="text-sm break-words">{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default EWayBillRequest;
