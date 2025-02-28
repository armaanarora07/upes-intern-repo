import React,{useEffect} from 'react'
import {useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo'
import PaymentQR from '../components/PaymentQR';
import { setTitle } from '../slices/navbarSlice';

function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(()=>{
    dispatch(setTitle('Settings'));
  })
    
  return (
    <div className='p-8 mt-10'>
    <div className='p-6 bg-white rounded-lg shadow-xl mt-5'>
       <Logo/>
    </div>
    <div className='p-6 bg-white rounded-lg shadow-xl mt-5'>
       <PaymentQR/>
    </div>
    <div className='p-6 bg-white rounded-lg shadow-xl mt-5'>
       <h2 className="text-2xl font-bold text-gray-800">Bill Templates</h2>
    </div>
    <div className='p-6 bg-white rounded-lg shadow-xl mt-5 cursor-pointer' onClick={()=>{navigate('/add-business')}}>
       <h2 className="text-2xl font-bold text-gray-800">Add Business</h2>
    </div>
    <div className='p-6 bg-white rounded-lg shadow-xl mt-5'>
       <h2 className="text-2xl font-bold text-gray-800">Enable E-way</h2>
    </div>
  </div>
  )
}

export default Settings;
