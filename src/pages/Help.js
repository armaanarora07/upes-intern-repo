import React,{useEffect} from 'react'
import {useDispatch} from 'react-redux';
import {setTitle} from '../slices/navbarSlice';

function Help() {
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(setTitle('Help and Support'));
  })

  return (
    <div className='p-8 mt-10'>

    <div className='p-6 bg-white rounded-lg shadow-xl mt-5'>
       <h2 className="text-2xl font-bold text-gray-800 flex justify-center">Please Reach out to us !</h2>
       <p className="text-2xl font-medium text-gray-800 flex justify-center">Email : info@sangrahinnovations.com</p>
    </div>
  </div>
  )
}

export default Help;
