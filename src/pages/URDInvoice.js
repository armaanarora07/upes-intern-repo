import React, { useEffect, useState } from 'react'
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
import SignatureSelection from '../components/SignatureSelection';

const URDInvoice = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { rows } = useSelector((state) => state.products);
  const userDetails = useSelector(selectUserDetails);
  const [invoiceType, setInvoiceType] = useState('urd/purchase-invoice');
  const [titleName, setTitleName] = useState('Buyer Details');
  const [isRequired, setisRequired] = useState(false);
  const [isInvoiceRequired,setisInvoiceRequired] = useState(false);

  const handleBillGeneration = ()=>{
    
    if(userDetails.tradeName.length > 0 && userDetails.phoneNo.length > 0  && rows.length > 0 && rows[0].hsn_code.length > 0 ){

      if(titleName === 'Buyer Details' && !userDetails.invoiceNo){
        setisInvoiceRequired(true);
        alert('Enter the Invoice Number');
        return;
      }

      setisRequired(false);
      navigate(`/generate-invoice?type=${invoiceType}`);
      return;

    }

    setisRequired(true);
    alert('Enter the Required Details');
    return;
  }

  useEffect(()=>{
    
    const setNavTitle = () =>{
      dispatch(setTitle('Create URD Invoice'));
    }

    setNavTitle();
  },[setTitle,dispatch])

   const handleDropdown = (value) =>{
       setInvoiceType(value);
       if(value === 'urd/purchase-invoice'){
          setTitleName('Buyer Details');
          setisInvoiceRequired(true);
       }else{
          setTitleName('Seller Details');
          setisInvoiceRequired(false);
       }
   }

  return (
    <div className="p-8 mt-10">
      <div className='p-6 bg-white border rounded-lg shadow-xl mt-5'>
          <h2 className="text-2xl font-bold text-gray-800">Select Invoice Type</h2>
          <select 
            className="border rounded px-3 py-1 mt-3 ml-2" 
            onChange={(e) => handleDropdown(e.target.value)}
          >
                <option value='urd/purchase-invoice'>
                  Purchase Invoice
                </option>
                <option value='urd/sales-invoice'>
                  Sales Invoice
                </option>
          </select>
      </div>
      <UserDetails Title = {titleName} isRequired={isRequired} isInvoiceRequired={isInvoiceRequired}/>
      <Products/>
      <BankDetails/>
      <TermsAndConditions/>
      <SignatureSelection/>
      <FloatingButton onClick={handleBillGeneration}/>
    </div>
  )
}

export default URDInvoice
