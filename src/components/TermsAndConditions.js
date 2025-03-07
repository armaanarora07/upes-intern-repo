import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setGSTtandcDetails } from '../slices/tandcSlice';

const TermsAndConditions = () => {
  const dispatch = useDispatch();
  const {GSTtandcDetails} = useSelector((state)=> state.tandc)
  const[terms,setTerms] = useState(GSTtandcDetails);

  const handletextChange = (e) =>{
    setTerms(e.target.value);
    dispatch(setGSTtandcDetails(e.target.value));
  }

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
