import React,{useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo'
import PaymentQR from '../components/PaymentQR';
import { setTitle } from '../slices/navbarSlice';

function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ewayEnabled = useSelector((state) => state.eway.eway_enabled); // access from global eway state 
  const enable = useSelector((state)=> state.eway.enable);

  useEffect(()=>{
    dispatch(setTitle('Settings'));
  })
    
  return (
    <div className='p-8 '>

    <div className='p-6 mt-5 mb-6 bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden'>
       <Logo/>
    </div>

    <div className='p-6 mt-5 mb-6 bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden'>
       <PaymentQR/>
    </div>

    <div className='p-6 mt-5 mb-6 bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden'>
       <h2 className="text-2xl font-bold text-gray-800">Bill Templates</h2>
    </div>

    <div className='p-6 mt-5 mb-6 bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden cursor-pointer' onClick={()=>{navigate('/add-business')}}>
       <h2 className="text-2xl font-bold text-gray-800">Add Business</h2>
    </div>

    <div className="p-6 mt-5 mb-6 bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden cursor-pointer" onClick={()=>{navigate('/update-eway')}}>
      <h2 className="text-2xl font-bold text-gray-800">Update E-way credentials</h2>
    </div>

  </div>
  )
}

export default Settings;

