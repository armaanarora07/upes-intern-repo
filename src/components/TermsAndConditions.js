import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTandC, setGSTtandcDetails } from '../slices/tandcSlice';
import axios from 'axios';


// With new changes in this code file, the text area will correctly show "Your terms and conditions text here." as a placeholder, and any text you enter will be saved and reloaded as expected - by sagar

const TermsAndConditions = () => {
  const dispatch = useDispatch();
  const { GSTtandcDetails } = useSelector((state) => state.tandc);
  const authToken = useSelector((state) => state.auth.authToken);
  
  // Initialize state to an empty string
  const [terms, setTerms] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Effect to fetch initial data
  useEffect(() => {
    dispatch(fetchTandC());
  }, [dispatch]);

  // Effect to update local state when Redux state changes
  useEffect(() => {
    // Check if the details from Redux are not the default placeholder text
    if (GSTtandcDetails && GSTtandcDetails !== 'Your terms and conditions text here.') {
      setTerms(GSTtandcDetails);
    } else {
      setTerms(''); // Keep it empty to show the placeholder
    }
  }, [GSTtandcDetails]);

  const handletextChange = (e) => {
    const newTerms = e.target.value;
    setTerms(newTerms);
    dispatch(setGSTtandcDetails(newTerms));

    if (typingTimeout) clearTimeout(typingTimeout);

    // Set a new timeout for saving after 2 seconds
    setTypingTimeout(
      setTimeout(() => {
        saveData({ tnc: newTerms });
      }, 2000)
    );
  };

  const saveData = async (reqBody) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/tnc`,
        reqBody,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-6 mt-5 mb-6 bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Terms and Conditions</h2>
      <div>
        <textarea
          className="w-full border border-[#4154f1] rounded-lg p-2 m-2 dark:bg-gray-600 dark:border-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4154f1]"
          value={terms}
          onChange={handletextChange}
          placeholder="Your terms and conditions text here."
          rows={5}
        />
      </div>
    </div>
  );
};

export default TermsAndConditions;