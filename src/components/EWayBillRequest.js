import React, { useEffect, useState } from "react";
import {useLocation} from 'react-router-dom';
import {FaFileAlt} from 'react-icons/fa';
import axios from "axios";
import { useSelector,useDispatch } from "react-redux";
import { clearGSTDetails } from '../slices/gstSlice';
import { clearProducts } from '../slices/productSlice';
import { clearUserDetails } from '../slices/userdetailsSlice';
import { setTitle } from "../slices/navbarSlice";

const EWayBillRequest = () => {
  const [vehicleNo, setVehicleNo] = useState("");
  const [billDocId, setBillDocId] = useState("");
  const [TransporterId, setTransporterId] = useState("");
  const [docNo, setDocNo] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const authToken = useSelector((state) => state.auth.authToken); // access from global auth state 
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(()=>{
    const setNavTitle = () =>{
      dispatch(setTitle('Generate E-Way Bill'));
    }

    setNavTitle();

  })

  useEffect(()=>{
    const getQueryParams = () => {
      return new URLSearchParams(location.search);
    };

    const fetchQueryparameter = () =>{

      const queryParams = getQueryParams();
      
      if(queryParams.size > 0){
        setBillDocId(queryParams.get('billid'));
      }

    }

    fetchQueryparameter();
  },[location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const requestData = {
        vehicle_no: vehicleNo,
        transported_id: TransporterId,  
        transporter_name: "", 
        bill_doc_id: billDocId,
        doc_no: docNo,
      };;

    console.log(requestData);

    try {
      const result = await axios.post(
        "/user/eway",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(result.data);

      setResponse(result.data);
    } catch (error) {
      setResponse(error.response?.data || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  const onDownloadbill = ()=>{
    window.open(response.url, '_blank');
    dispatch(clearGSTDetails());
    dispatch(clearProducts());
    dispatch(clearUserDetails());
  }

  return (
    <div className="p-8 mt-10">
       <div className="mt-5">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-4">Request E-Way Bill</h2>
          
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">

            <label className="block mb-2">
              Transporter Id
              <input
                type="text"
                value={TransporterId}
                onChange={(e) => setTransporterId(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </label>
            <h3 className="text-center my-2">OR</h3>
            <label className="block mb-2">
              Vehicle No
              <input
                type="text"
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </label>
            
            <label className="block mb-4">
              Document No
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
            <div className="mt-5">
            <button
             className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-2 transition duration-200 hover:bg-blue-600 shadow-md"
             onClick={onDownloadbill}
             >
             Download Bill
           </button>
           </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EWayBillRequest;
