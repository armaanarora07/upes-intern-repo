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
    <div className='p-8 min-h-screen dark:bg-gray-800'>

    <div className='p-6 mt-5 mb-6 bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700'>
       <Logo/>
    </div>

    <div className='p-6 mt-5 mb-6 bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700'>
       <PaymentQR/>
    </div>

    <div className='p-6 mt-5 mb-6 bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700'>
       <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Bill Templates</h2>
    </div>

    <div className='p-6 mt-5 mb-6 bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden cursor-pointer dark:bg-gray-800 dark:border-gray-700' onClick={()=>{navigate('/add-business')}}>
       <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Add Business</h2>
    </div>

    <div className="p-6 mt-5 mb-6 bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden cursor-pointer dark:bg-gray-800 dark:border-gray-700" onClick={()=>{navigate('/update-eway')}}>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Update E-way credentials</h2>
    </div>

  </div>
  )
}

export default Settings;

