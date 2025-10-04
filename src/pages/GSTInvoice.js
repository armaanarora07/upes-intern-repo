import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import GSTVerify from '../components/GSTVerify';
import UserDetails from '../components/UserDetails';
import Products from '../components/Products';
import BankDetails from '../components/BankDetails';
import TermsAndConditions from '../components/TermsAndConditions';
import Signature from '../components/Signature';
import Stamp from '../components/Stamp';
import { useDispatch, useSelector } from 'react-redux';
import {setTitle} from '../slices/navbarSlice';
import FloatingButton from '../components/FloatingButton';
import { selectUserDetails } from '../slices/userdetailsSlice';
import SignatureSelection from '../components/SignatureSelection';
import StaggeredContainer, { StaggeredItem } from '../components/StaggeredContainer';

const GSTInvoice = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { rows } = useSelector((state) => state.products);
  const { gstDetails } = useSelector((state) => state.gst);
  const userDetails = useSelector(selectUserDetails);
  const [isRequired, setisRequired] = useState(false);


  const handleBillGeneration = ()=>{
    
      if(gstDetails && userDetails.tradeName.length > 0 && userDetails.phoneNo.length > 0 && rows.length > 0 && rows[0].hsn_code.length > 0 ){
        setisRequired(false);
        // Save this page to sessionStorage before navigating
        sessionStorage.setItem('lastInvoicePage', '/gst-invoice');
        navigate('/generate-invoice?type=gstinvoice');
        return;
      }
      setisRequired(true);
      alert('Enter the Required Details');
      return;
  }

  useEffect(()=>{
    // Save this page to sessionStorage on component mount
    sessionStorage.setItem('lastInvoicePage', '/gst-invoice');
    
    const setNavTitle = () =>{
      dispatch(setTitle('Create GST Invoice'));
    }

    setNavTitle();
  },[setTitle,dispatch])

  return (
    <div className="p-8">
      <StaggeredContainer>
        <StaggeredItem>
          <GSTVerify isRequired={isRequired}/>
        </StaggeredItem>
        <StaggeredItem>
          <UserDetails Title={'Buyer Details'} isRequired={isRequired}/>
        </StaggeredItem>
        <StaggeredItem>
          <Products/>
        </StaggeredItem>
        <StaggeredItem>
          <BankDetails/>
        </StaggeredItem>
        <StaggeredItem>
          <TermsAndConditions/>
        </StaggeredItem>
        <StaggeredItem>
          <SignatureSelection/>
        </StaggeredItem>
      </StaggeredContainer>
      <FloatingButton onClick={handleBillGeneration}/>
    </div>
  )
}

export default GSTInvoice
