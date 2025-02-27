import React, { useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import GSTVerify from '../components/GSTVerify';
import UserDetails from '../components/UserDetails';
import Products from '../components/Products';
import BankDetails from '../components/BankDetails';
import TermsAndConditions from '../components/TermsAndConditions';
import Signature from '../components/Signature';
import Stamp from '../components/Stamp';
import { useDispatch,useSelector } from 'react-redux';
import { selectUserDetails } from '../slices/userdetailsSlice';
import {setTitle} from '../slices/navbarSlice';
import FloatingButton from '../components/FloatingButton';

const URDInvoice = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { rows } = useSelector((state) => state.products);
  const userDetails = useSelector(selectUserDetails);

  const handleBillGeneration = ()=>{
    if(userDetails.tradeName.length > 0 && rows.length > 0 && rows[0].hsn_code.length > 0 ){
      navigate('/generate-invoice?type=invoice');
      return;
    }
    alert('Enter the Required Details');
  }

  useEffect(()=>{
    
    const setNavTitle = () =>{
      dispatch(setTitle('Create Invoice'));
    }

    setNavTitle();
  },[setTitle,dispatch])

  return (
    <div className="p-8 mt-10">
      <UserDetails/>
      <Products/>
      <BankDetails/>
      <TermsAndConditions/>
      <div className="p-6 bg-white rounded-lg shadow-xl mt-5 flex flex-col sm:flex-row justify-between">
      <Signature/>
      <Stamp/>
      </div>
      <FloatingButton onClick={handleBillGeneration}/>
    </div>
  )
}

export default URDInvoice
