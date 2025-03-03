import React,{useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo'
import PaymentQR from '../components/PaymentQR';
import { setTitle } from '../slices/navbarSlice';
import { toggle } from '../slices/ewaySlice';

function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ewayEnabled = useSelector((state) => state.eway.eway_enabled); // access from global eway state 
  const enable = useSelector((state)=> state.eway.enable);

  useEffect(()=>{
    dispatch(setTitle('Settings'));
  })

  const handleToggle = ()=>{
    dispatch(toggle());
  }

  const handleActivateEway = () => {
    navigate('/eway-bills');
  }
    
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

    <div className="flex items-center justify-between p-6 bg-white rounded-lg shadow-xl mt-5">
      <h2 className="text-2xl font-bold text-gray-800">Enable E-way</h2>
      {ewayEnabled ? 
      (
      <div> 
         <label className="flex items-center cursor-pointer">
         <input type="checkbox" className="hidden" checked={enable} onChange={handleToggle} />
         <div 
            className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${
            enable ? 'bg-blue-500' : 'bg-gray-400'
            }`}
         >
            <div 
            className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
               enable ? 'translate-x-7' : 'translate-x-0'
            }`}
            ></div>
         </div>
         </label>  
      </div>
      )
      :
      ( 
      <div>
         <button
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleActivateEway}
            >
            Activate E-way Services
         </button>
      </div>
      )
      }
    </div>

  </div>
  )
}

export default Settings;

