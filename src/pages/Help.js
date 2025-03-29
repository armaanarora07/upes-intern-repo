import React,{useEffect} from 'react'
import {useDispatch} from 'react-redux';
import {setTitle} from '../slices/navbarSlice';

function Help() {
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(setTitle('Help and Support'));
  })

  return (
    <div className='p-8 min-h-screen dark:bg-gray-800'>

    <div className='p-6 mt-5 mb-6 bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700'>
       <h2 className="text-2xl font-bold text-gray-800 flex justify-center dark:text-gray-200">Please Reach out to us !</h2>
       <p className="text-2xl font-medium text-gray-800 flex justify-center dark:text-gray-200">Email : info@sangrahinnovations.com</p>
    </div>
  </div>
  )
}

export default Help;
