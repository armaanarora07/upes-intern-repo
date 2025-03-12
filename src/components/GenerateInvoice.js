import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { selectUserDetails, selectShippingAddress,  } from "../slices/userdetailsSlice";
import { clearGSTDetails } from '../slices/gstSlice';
import { clearProducts } from '../slices/productSlice';
import { clearUserDetails } from '../slices/userdetailsSlice';
import { setTitle } from "../slices/navbarSlice";
import numberToWords from "number-to-words";
import Template1 from "../billtemplates/Template1";
import Template2 from "../billtemplates/Template2";
import ActionModal from "./ActionModal";
import axios from "axios";

const InvoicePage = () => {
  const [invoiceData, setInvoiceData] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);
  const [invoiceType, setInvoiceType] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState('template1');
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [billId,setBillId] = useState('');
  const location = useLocation();
  const authToken = useSelector((state) => state.auth.authToken); 
  
  const templates = {
    template1: Template2,
    template2:Template1
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { rows } = useSelector((state) => state.products);
  const { gstDetails } = useSelector((state) => state.gst);
  const userDetails = useSelector(selectUserDetails);
  const { GSTtandcDetails } = useSelector((state) => state.tandc);
  const { businesses,selectedBusiness } = useSelector((state) => state.business);
  const { signature } = useSelector((state) => state.signature);
  const signatureEnabled = useSelector((state)=> state.signature.enabled);
  const { stamp } = useSelector((state) => state.stamp);
  const stampEnabled = useSelector((state)=> state.stamp.enabled);
  const {logo} = useSelector((state)=> state.logo);
  const {qr} = useSelector((state)=> state.qr);
  const { selectedGBank } = useSelector((state) => state.banks);
  const bankEnabled = useSelector((state)=> state.banks.enabled);
  const attestationSelection = useSelector((state) => state.toggle.enabled);

   const [business, setSelectedBusiness] = useState(
      () => businesses?.find((b) => b._id === selectedBusiness) || {}
    );

    console.log(businesses);

  const getQueryParams = () => {
    return new URLSearchParams(location.search);
  };

  
  useEffect(()=>{

    const fetchQueryparameter = () =>{

      const queryParams = getQueryParams();
      
      if(queryParams.size > 0){
        setInvoiceType(queryParams.get('type'));
      }

    }

    fetchQueryparameter();

    console.log(invoiceType);

    if(userDetails.tradeName.length === 0 && rows[0].hsn_code.length === 0 ){
      if(invoiceType === 'gstinvoice'){
        navigate('/gst-invoice');
      }else{
        navigate('/urd-invoice');
      }

    }

  },[location,navigate,rows,gstDetails,userDetails]);

  const calculateInvoiceTotals = (data) => {
    if (!data || !Array.isArray(data.hsn_details) || !Array.isArray(data.quantities) || !Array.isArray(data.rates)) {
        console.error("Invalid data structure:", data);
        return null;
    }

    const calculatedData = { ...data };
    let overallTotalTax = 0;
    let overallTotalCGSTTax = 0;
    let overallTotalSGSTTax = 0;
    let overallTotalTaxableAmount = 0;
    let overallTotalAmount = 0;
    let cgst = 0;
    let sgst = 0;
    let overallUnit = '';
    let totalQuantity = 0;

    calculatedData.hsn_details.forEach((item, index) => {
        // Ensure values are valid numbers
        const quantity = Number(calculatedData.quantities[index]) || 0;
        const unitPrice = Number(calculatedData.rates[index]) || 0;
        const cgstRate = parseFloat(item.cgst) || 0;
        const sgstRate = parseFloat(item.sgst) || 0;
        const unit = item.unit;
        console.log({cgstRate,sgstRate})
        const taxRate = cgstRate + sgstRate;

        // Calculate values safely
        const taxableAmount = unitPrice * quantity;
        const taxPerUnit = (unitPrice * taxRate) / 100;
        const totalTax = taxPerUnit * quantity;
        const totalAmount = taxableAmount + totalTax;

        const CGSTtaxPerUnit = (unitPrice * cgstRate) / 100;
        const totalCGSTTax = CGSTtaxPerUnit * quantity;

        const SGSTtaxPerUnit = (unitPrice * sgstRate) / 100;
        const totalSGSTTax = SGSTtaxPerUnit * quantity;

        // Assign rounded values
        item.taxableAmount = taxableAmount.toFixed(2);
        item.totalTax = totalTax.toFixed(2);
        item.totalCGSTTax = totalCGSTTax.toFixed(2);
        item.totalSGSTTax = totalSGSTTax.toFixed(2);
        item.totalAmount = totalAmount.toFixed(2);

        // Accumulate totals safely
        overallTotalTaxableAmount += taxableAmount;
        overallTotalTax += totalTax;
        overallTotalCGSTTax += totalCGSTTax;
        overallTotalSGSTTax += totalSGSTTax;
        overallTotalAmount += totalAmount;
        totalQuantity += quantity;
        cgst = cgstRate;
        sgst = sgstRate;
        overallUnit = unit;
    });

    // Convert totals to fixed decimal values
    calculatedData.totalTaxableAmount = overallTotalTaxableAmount.toFixed(2);
    calculatedData.totalTax = overallTotalTax.toFixed(2);
    calculatedData.totalCGSTTax = overallTotalCGSTTax.toFixed(2);
    calculatedData.totalSGSTTax = overallTotalSGSTTax.toFixed(2);
    calculatedData.totalAmount = overallTotalAmount.toFixed(2);
    calculatedData.cgstRate = cgst;
    calculatedData.sgstRate = sgst;
    calculatedData.totalQuantity = totalQuantity;
    calculatedData.unit = overallUnit;

    // Ensure total amount is a valid number before converting to words
    if (!isNaN(overallTotalAmount) && isFinite(overallTotalAmount)) {
        calculatedData.totalAmountInWords = numberToWords
            .toWords(Math.floor(overallTotalAmount))
            .replace(/\b\w/g, (char) => char.toUpperCase()) + " Rupees Only";
    } else {
        console.error("Error: Invalid total amount for conversion:", overallTotalAmount);
        calculatedData.totalAmountInWords = "Invalid Amount";
    }

    console.log("Final Calculated Data:", calculatedData);
    return calculatedData;
  };
  
  const generatePreview = (templateData) => {
    const BillTemplate = templates[selectedTemplate];
    const billTemplate = new BillTemplate();
    const doc = billTemplate.generateInvoice(templateData);
    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    setPreviewUrl(url);
  };

  useEffect(() => {
    dispatch(setTitle('Generate Invoice'));
    
    if ((gstDetails || userDetails) && rows && rows.length > 0) {
      const invoiceDataFromGlobal = {
        firstParty: {
          gstin: business ? business.gstin : '',
          legal_name: business ? business.legal_name: '',
          trade_name: business ? business.trade_name: '',
          principal_address: business ? business.principal_address: '',
          shipping_address: business ? business.shipping_address: ''
        },
        party: {
          gstin:  gstDetails ? gstDetails.gstin : '',
          legal_name:  gstDetails ? gstDetails.legalName : userDetails.legalName,
          trade_name:  gstDetails ? gstDetails.tradeName : userDetails.tradeName,
          principal_address:  gstDetails ? gstDetails.principalAddress : userDetails.primaryAddress,
          shipping_address:  gstDetails ? gstDetails.shippingAddress : userDetails.shippingAddress,
          invoiceDate: userDetails.invoiceDate,
          invoiceNo:userDetails.invoiceNo,
          phoneNo: userDetails.phoneNo,
        },
        quantities: rows.map((row) => row.quantity),
        hsn_details: rows.map((row) => ({
          hsn_code: row.hsn_code,
          product_info: row.product_info,
          cgst: row.cgst,
          sgst: row.sgst,
          unit: row.unit,
        })),
        rates: rows.map((row) => row.price),
        tandc: GSTtandcDetails,
        signature: signature,
        stamp: stamp,
        logo:logo,
        qr:qr,
        bank: selectedGBank,
        signatureEnabled:signatureEnabled,
        stampEnabled:stampEnabled,
        bankEnabled:bankEnabled,
        attestationSelection:attestationSelection
      };

      const calculatedInvoice = calculateInvoiceTotals(invoiceDataFromGlobal);
      setInvoiceData(calculatedInvoice);
      generatePreview(calculatedInvoice);
    }
  }, [rows, gstDetails,selectedBusiness, userDetails, GSTtandcDetails, signature, stamp, selectedGBank, dispatch, selectedTemplate]);

  const handleTemplateChange = (e) => {
    setSelectedTemplate(e.target.value);
  };

  const handleCloseModal = () =>{
    setShowPdfModal(false);
    dispatch(clearGSTDetails());
    dispatch(clearProducts());
    dispatch(clearUserDetails());
  }

  const handleDownloadPDF = () => {
    if (!previewUrl) {
      alert('No Items are added');
      return;
    }
    
    const BillTemplate = templates[selectedTemplate] || Template1;
    const billTemplate = new BillTemplate();
    const doc = billTemplate.generateInvoice(invoiceData);
    const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
    const uniqueName = `${invoiceType}_${timestamp}.pdf`;
    doc.save(uniqueName);
  };

  const handleGSTBill = async () =>{
    
    const body = { 
      party: {
        gstin: gstDetails.gstin,
        legal_name: gstDetails.legalName,
        trade_name: gstDetails.tradeName,
        principal_address: {
          address1: gstDetails.principalAddress.address1,
          address2: gstDetails.principalAddress.address2,
          pincode: gstDetails.principalAddress.pincode,
          city: gstDetails.principalAddress.city,
          state: gstDetails.principalAddress.state,
          country: gstDetails.principalAddress.country,
        },
        shipping_address: {
          address1: gstDetails.shippingAddress.address1,
          address2: gstDetails.shippingAddress.address2,
          pincode: gstDetails.shippingAddress.pincode,
          city: gstDetails.shippingAddress.city,
          state: gstDetails.shippingAddress.state,
          country: gstDetails.shippingAddress.country,
        },
      },
      quantities: rows.map((row) => parseFloat(row.quantity)),
      hsn_details: rows.map((row) => ({
        hsn_code: row.hsn_code,
        product_info: row.product_info,
        cgst: parseFloat(row.cgst).toString(), // Convert to number and back to string
        sgst: parseFloat(row.sgst).toString(), // Convert to number and back to string
        unit: row.unit,
      })),
      rates: rows.map((row) => row.price),
    };

    console.log(body);
  
    try {
      //handleOpenAlert('success', 'PDF is downloading...');
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/user/bill`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
  
      if (response.status === 200) {
        const Url = response.data.url; // Access the URL from the response data
        setBillId(response.data.bill_doc_id);
        if (Url) {
          setShowPdfModal(true); // Show the modal after downloading
        } else {
         // handleOpenAlert('error','Download URL is missing in the response.');
        }
      } else {
        //handleOpenAlert('error','Failed to generate PDF. Please try again.');
        console.error(`Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      //handleOpenAlert('error','An error occurred while downloading the PDF.');
      console.error(error);
    }
  }

  const handleURDPurchaseBill = async () =>{
    
    const body = { 
      sn_no: userDetails.invoiceNo,
      party: {
        gstin: "",
        name: userDetails.tradeName,
        contact :userDetails.phoneNo,
        shipping_address: userDetails.shippingAddress,
      },
      quantities: rows.map((row) => parseFloat(row.quantity)),
      hsn_details: rows.map((row) => ({
        hsn_code: row.hsn_code,
        product_info: row.product_info,
        cgst: parseFloat(row.cgst).toString(), // Convert to number and back to string
        sgst: parseFloat(row.sgst).toString(), // Convert to number and back to string
        unit: row.unit,
      })),
      rates: rows.map((row) => row.price),
      bill_date: userDetails.invoiceDate,
    };

    console.log(body);
  
    try {
      //handleOpenAlert('success', 'PDF is downloading...');
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/user/purchasebill`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
  
      if (response.status === 200) {
        const Url = response.data.url; // Access the URL from the response data
        //setBillId(response.data.bill_doc_id);
        if (Url) {
          setShowPdfModal(true); // Show the modal after downloading
        } else {
         // handleOpenAlert('error','Download URL is missing in the response.');
        }
      } else {
        //handleOpenAlert('error','Failed to generate PDF. Please try again.');
        console.error(`Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      //handleOpenAlert('error','An error occurred while downloading the PDF.');
      console.error(error);
    }
  }

  const handleURDSalesBill = async () =>{
    
    const body = { 
      party: {
        gstin: userDetails.phoneNo,
        legal_name: userDetails.legalName,
        trade_name: userDetails.tradeName,
        principal_address: userDetails.primaryAddress,
        shipping_address: userDetails.shippingAddress
      },
      quantities: rows.map((row) => parseFloat(row.quantity)),
      hsn_details: rows.map((row) => ({
        hsn_code: row.hsn_code,
        product_info: row.product_info,
        cgst: parseFloat(row.cgst).toString(), // Convert to number and back to string
        sgst: parseFloat(row.sgst).toString(), // Convert to number and back to string
        unit: row.unit,
      })),
      rates: rows.map((row) => row.price),
    };
  
    try {
      //handleOpenAlert('success', 'PDF is downloading...');
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/user/bill`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
  
      if (response.status === 200) {
        const Url = response.data.url; // Access the URL from the response data
        setBillId(response.data.bill_doc_id);
        if (Url) {
          setShowPdfModal(true); // Show the modal after downloading
        } else {
         // handleOpenAlert('error','Download URL is missing in the response.');
        }
      } else {
        //handleOpenAlert('error','Failed to generate PDF. Please try again.');
        console.error(`Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      //handleOpenAlert('error','An error occurred while downloading the PDF.');
      console.error(error);
    }
  }


  const addBill = async () =>{

      if(invoiceType === 'gstinvoice'){
        handleGSTBill();
      }else if(invoiceType === 'urd/purchase-invoice'){
        handleURDPurchaseBill();
      }else if(invoiceType === 'urd/sales-invoice'){
        handleURDSalesBill();
      }else{
        alert('Invalid Invoice Type');
        return;
      }
  }

  const generateEway = () =>{
    navigate(`/EWayBillRequest?billid=${billId}`);
    dispatch(clearGSTDetails());
    dispatch(clearProducts());
    dispatch(clearUserDetails());
  }

  const createNewBill = () =>{
    if(invoiceType === 'gstinvoice'){
      navigate('/gst-invoice');
    }else{
      navigate('/urd-invoice');
    }
    dispatch(clearGSTDetails());
    dispatch(clearProducts());
    dispatch(clearUserDetails());

  }

  return (
    <div className="flex flex-col lg:flex-row w-full p-8 lg:space-x-6">
      {/* Left Pane - PDF Preview */}
      <div className="flex-1 p-6 bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden mt-2">

        <div className="text-2xl font-bold text-gray-800 mb-3">
          Invoice Preview
        </div>

        <div className="flex justify-center">
          <iframe
            title="invoice-preview"
            src={previewUrl}
            className="w-3/4 h-[80vh] border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* Right Pane - Controls */}
      <div className="w-full lg:w-1/3 h-auto p-6 bg-white border rounded-lg shadow-xl border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col items-center mt-2">
        <div className="text-2xl font-bold text-gray-800 mb-3">
          Customize Invoice
        </div>
        
        {/* Template Selection */}
        <div className="w-full max-w-sm mb-6">
          <label className="block text-gray-700 text-xl font-bold mb-2">Select Template</label>
          <select
            value={selectedTemplate}
            onChange={handleTemplateChange}
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.keys(templates).map((key) => (
              <option key={key} value={key}>
                {`Template ${key.charAt(key.length - 1)}`}
              </option>
            ))}
          </select>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col space-y-4 w-full">
          <button
            className="px-6 py-3 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200"
            onClick={addBill}
          >
            Generate Invoice
          </button>
          <button
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
            onClick={() => navigate('/gst-invoice')}
          >
            Edit Invoice
          </button>
        </div>

        {/*Action Modal*/}
        <ActionModal
        isOpen={showPdfModal}
        onClose={handleCloseModal}
        onGenerateEway={generateEway}
        onCreateNewBill={createNewBill}
        onDownloadbill={handleDownloadPDF}
        invoiceType={invoiceType}
        />
      </div>
    </div>
  );
};

export default InvoicePage;
