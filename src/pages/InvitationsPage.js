import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector,useDispatch } from "react-redux";
import {setTitle} from '../slices/navbarSlice';

const InviteUserForm = () => {
  const [userData, setUserData] = useState({ contactOrEmail: "", gstin: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const authToken = useSelector((state) => state.auth.authToken);
  const dispatch = useDispatch();

  useEffect(()=>{
      const setNavTitle = () =>{
        dispatch(setTitle('Invite User'));
      }
  
      setNavTitle();
    },[setTitle,dispatch])

  const validateInput = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const contactRegex = /^\d{10}$/;
    if (!emailRegex.test(userData.contactOrEmail) && !contactRegex.test(userData.contactOrEmail)) {
      newErrors.contactOrEmail = "Enter a valid email or 10-digit phone number";
    }
    if (userData.gstin.length !== 15) {
      newErrors.gstin = "GSTIN should be exactly 15 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;
    setLoading(true);
    setMessage(null);
    try {
      const payload = { invitedTo: userData.gstin };
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.contactOrEmail)) {
        payload.email = userData.contactOrEmail;
      } else {
        payload.contact = userData.contactOrEmail;
      }
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/invite`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      setMessage({ type: "success", text: response.data.message || "User invited successfully!" });
      setUserData({ contactOrEmail: "", gstin: "" });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to invite user.",
      });
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 className="font-semibold text-lg mb-4 text-center">Invite User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Email or Contact"
          value={userData.contactOrEmail}
          onChange={(e) => setUserData({ ...userData, contactOrEmail: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        {errors.contactOrEmail && <p className="text-red-500 text-sm">{errors.contactOrEmail}</p>}
        <input
          type="text"
          placeholder="GSTIN"
          value={userData.gstin}
          onChange={(e) => setUserData({ ...userData, gstin: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        {errors.gstin && <p className="text-red-500 text-sm">{errors.gstin}</p>}
        <button
          type="submit"
          className={`mt-5 w-full bg-blue-500 text-white py-2 rounded shadow-md hover:bg-blue-600 transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Inviting..." : "Invite User"}
        </button>
        {message && (
          <p className={`mt-2 text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
};

const InviteUserPage = () => {
  return (
    <div className="flex justify-center p-8 mt-5">
      <div className="bg-white border rounded-lg shadow-xl border-gray-200 overflow-hidden w-full max-w-lg p-8">
        <InviteUserForm />
      </div>
    </div>
  );
};

export default InviteUserPage;
