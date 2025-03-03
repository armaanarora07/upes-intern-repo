import React,{useEffect} from 'react'
import {useDispatch} from 'react-redux';
import {setTitle} from '../slices/navbarSlice';

const Messages = () => {
  const dispatch = useDispatch();
  
    useEffect(()=>{
      dispatch(setTitle('Messages'));
    })
  
  return (
    <div>
       
    </div>
  )
}

export default Messages
