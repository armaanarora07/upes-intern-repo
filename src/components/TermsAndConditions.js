import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTandC, setGSTtandcDetails } from '../slices/tandcSlice';
import axios from 'axios';

const TermsAndConditions = () => {
  const dispatch = useDispatch();
  const {GSTtandcDetails} = useSelector((state)=> state.tandc)
  const authToken = useSelector((state) => state.auth.authToken);
  const[terms,setTerms] = useState(GSTtandcDetails);

  const [typingTimeout, setTypingTimeout] = useState(null);

  const handletextChange = (e) =>{
    setTerms(e.target.value);
    dispatch(setGSTtandcDetails(e.target.value));

    if (typingTimeout) clearTimeout(typingTimeout);

    // Set a new timeout for saving after 2 second
    setTypingTimeout(
      setTimeout(() => {
        saveData({tnc:terms});
      }, 2000)
    );
  }

  const saveData = async (reqBody) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/tnc`,
         reqBody, // Data being sent in POST request
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      console.log(response.data); // Returning the newly added bank details
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(()=>{
    dispatch(fetchTandC());
  },[dispatch]);

  return (
    <div className="p-6 mt-5 mb-6 bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <h2 className="text-2xl font-bold text-gray-800">Terms and Conditions</h2>
        <div>
         <textarea
            className="w-full border border-[#4154f1] rounded-lg p-2 m-2"
            value={terms} // Update to the correct state variable
            onChange={(e) => handletextChange(e) } 
            placeholder="Enter terms and conditions here..."
            rows={5} // Adjust the number of rows as needed
         />
        </div>
    </div>
  );
};

export default TermsAndConditions;
