import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { selectUserDetails } from "../slices/userdetailsSlice";
import { clearGSTDetails } from '../slices/gstSlice';
import { clearProducts } from '../slices/productSlice';
import { clearUserDetails } from '../slices/userdetailsSlice';
import numberToWords from "number-to-words";
import Template1 from "../billtemplates/Template1";
import Template2 from "../billtemplates/Template2";
import ActionModal from "./ActionModal";
import TopAlert from './TopAlert';
import axios from "axios";
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

const InvoicePage = () => {
  const [invoiceData, setInvoiceData] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);
  const [invoiceType, setInvoiceType] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState('template1');
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [billId, setBillId] = useState('');
  const [modalKey, setModalKey] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const authToken = useSelector((state) => state.auth.authToken);
  const { rows } = useSelector((state) => state.products);
  const { gstDetails } = useSelector((state) => state.gst);
  const userDetails = useSelector(selectUserDetails);
  const { GSTtandcDetails } = useSelector((state) => state.tandc);
  const { businesses, selectedBusiness } = useSelector((state) => state.business);
  const { signature } = useSelector((state) => state.signature);
  const signatureEnabled = useSelector((state) => state.signature.enabled);
  const { stamp } = useSelector((state) => state.stamp);
  const stampEnabled = useSelector((state) => state.stamp.enabled);
  const { logo } = useSelector((state) => state.logo);
  const { qr } = useSelector((state) => state.qr);
  const { selectedGBank } = useSelector((state) => state.banks);
  const bankEnabled = useSelector((state) => state.banks.enabled);
  const attestationSelection = useSelector((state) => state.toggle.enabled);

  const [business, setSelectedBusiness] = useState(
    () => businesses?.find((b) => b._id === selectedBusiness) || {}
  );
  const [topAlert, setTopAlert] = useState({ show: false, type: 'warning', message: '', position: 'top-center' });

  const templates = {
    template1: Template2,
    template2: Template1
  };

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
      const quantity = Number(calculatedData.quantities[index]) || 0;
      const unitPrice = Number(calculatedData.rates[index]) || 0;
      const cgstRate = parseFloat(item.cgst) || 0;
      const sgstRate = parseFloat(item.sgst) || 0;
      const unit = item.unit;
      const taxRate = cgstRate + sgstRate;

      const taxableAmount = unitPrice * quantity;
      const taxPerUnit = (unitPrice * taxRate) / 100;
      const totalTax = taxPerUnit * quantity;
      const totalAmount = taxableAmount + totalTax;

      const CGSTtaxPerUnit = (unitPrice * cgstRate) / 100;
      const totalCGSTTax = CGSTtaxPerUnit * quantity;

      const SGSTtaxPerUnit = (unitPrice * sgstRate) / 100;
      const totalSGSTTax = SGSTtaxPerUnit * quantity;

      item.taxableAmount = taxableAmount.toFixed(2);
      item.totalTax = totalTax.toFixed(2);
      item.totalCGSTTax = totalCGSTTax.toFixed(2);
      item.totalSGSTTax = totalSGSTTax.toFixed(2);
      item.totalAmount = totalAmount.toFixed(2);

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

    calculatedData.totalTaxableAmount = overallTotalTaxableAmount.toFixed(2);
    calculatedData.totalTax = overallTotalTax.toFixed(2);
    calculatedData.totalCGSTTax = overallTotalCGSTTax.toFixed(2);
    calculatedData.totalSGSTTax = overallTotalSGSTTax.toFixed(2);
    calculatedData.totalAmount = overallTotalAmount.toFixed(2);
    calculatedData.cgstRate = cgst;
    calculatedData.sgstRate = sgst;
    calculatedData.totalQuantity = totalQuantity;
    calculatedData.unit = overallUnit;

    if (!isNaN(overallTotalAmount) && isFinite(overallTotalAmount)) {
      calculatedData.totalAmountInWords = numberToWords
        .toWords(Math.floor(overallTotalAmount))
        .replace(/\b\w/g, (char) => char.toUpperCase()) + " Rupees Only";
    } else {
      console.error("Error: Invalid total amount for conversion:", overallTotalAmount);
      calculatedData.totalAmountInWords = "Invalid Amount";
    }

    return calculatedData;
  };

  const generatePreview = (templateData) => {
    try {
      const BillTemplate = templates[selectedTemplate] || Template1;
      const billTemplate = new BillTemplate();
      const doc = billTemplate.generateInvoice(templateData);
      const pdfBlob = doc.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      setPreviewUrl(url);
    } catch (err) {
      console.error('Error generating preview:', err);
    }
  };

  useEffect(() => {
    // Build invoice data from global slices when rows or related state changes
    if (!rows || rows.length === 0) return;

    const invoiceDataFromGlobal = {
      firstParty: {
        gstin: business ? business.gstin : '',
        legal_name: business ? business.legal_name : '',
        trade_name: business ? business.trade_name : '',
        principal_address: business ? business.principal_address : '',
        shipping_address: business ? business.shipping_address : ''
      },
      party: {
        gstin: gstDetails?.gstin || userDetails?.gstin || '',
        legal_name: userDetails?.legalName || business?.legal_name || '',
        trade_name: userDetails?.tradeName || business?.trade_name || '',
        principal_address: userDetails?.primaryAddress || business?.principal_address || '',
        shipping_address: userDetails?.shippingAddress || business?.shipping_address || '',
        invoiceDate: userDetails?.invoiceDate || '',
        invoiceNo: userDetails?.invoiceNo || '',
        phoneNo: userDetails?.phoneNo || ''
      },
      quantities: rows.map((r) => parseFloat(r.quantity) || 0),
      hsn_details: rows.map((row) => ({
        hsn_code: row.hsn_code || '',
        product_info: row.product_info || row.name || '',
        cgst: row.cgst || '0',
        sgst: row.sgst || '0',
        unit: row.unit || ''
      })),
      rates: rows.map((r) => r.price || 0),
      tandc: GSTtandcDetails,
      signature: signature,
      stamp: stamp,
      logo: logo,
      qr: qr,
      bank: selectedGBank,
      signatureEnabled: signatureEnabled,
      stampEnabled: stampEnabled,
      bankEnabled: bankEnabled,
      attestationSelection: attestationSelection
    };

    const calculatedInvoice = calculateInvoiceTotals(invoiceDataFromGlobal);
    setInvoiceData(calculatedInvoice);
    generatePreview(calculatedInvoice);
  }, [rows, gstDetails, selectedBusiness, userDetails, GSTtandcDetails, signature, stamp, selectedGBank, selectedTemplate, business, logo, qr, signatureEnabled, stampEnabled, bankEnabled, attestationSelection]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.size > 0) {
      setInvoiceType(queryParams.get('type'));
    }
  }, [location.search]);

  const handleTemplateChange = (e) => {
    setSelectedTemplate(e.target.value);
  };

  const handleSimpleCloseModal = () => setShowPdfModal(false);

  const handleCloseModalAndClear = () => {
    setShowPdfModal(false);
    setBillId('');
    dispatch(clearGSTDetails());
    dispatch(clearProducts());
    dispatch(clearUserDetails());
  };

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

  const handleGSTBill = async () => {
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
        cgst: parseFloat(row.cgst).toString(),
        sgst: parseFloat(row.sgst).toString(),
        unit: row.unit,
      })),
      rates: rows.map((row) => row.price),
      terms: GSTtandcDetails,
      bank: selectedGBank
    };

    try {
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
        const Url = response.data.url;
        setBillId(response.data.bill_doc_id);
        // Return success if server returned a document URL
        return !!Url;
      } else {
        console.error(`Error: ${response.status} ${response.statusText}`);
        return false;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleURDPurchaseBill = async () => {
    const body = { 
      sn_no: userDetails.invoiceNo,
      party: {
        gstin: "",
        name: userDetails.tradeName,
        contact: userDetails.phoneNo,
        shipping_address: userDetails.shippingAddress,
      },
      quantities: rows.map((row) => parseFloat(row.quantity)),
      hsn_details: rows.map((row) => ({
        hsn_code: row.hsn_code,
        product_info: row.product_info,
        cgst: parseFloat(row.cgst).toString(),
        sgst: parseFloat(row.sgst).toString(),
        unit: row.unit,
      })),
      rates: rows.map((row) => row.price),
      bill_date: userDetails.invoiceDate,
    };

    try {
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
        const Url = response.data.url;
        // Return true when a URL is present so caller can open modal
        return !!Url;
      } else {
        console.error(`Error: ${response.status} ${response.statusText}`);
        return false;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleURDSalesBill = async () => {
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
        cgst: parseFloat(row.cgst).toString(),
        sgst: parseFloat(row.sgst).toString(),
        unit: row.unit,
      })),
      rates: rows.map((row) => row.price),
      terms: GSTtandcDetails,
      bank: selectedGBank
    };

    try {
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
        const Url = response.data.url;
        setBillId(response.data.bill_doc_id);
        return !!Url;
      } else {
        console.error(`Error: ${response.status} ${response.statusText}`);
        return false;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addBill = async () => {
    // Reset modal state so it can be re-opened after previous usage
    setShowPdfModal(false);
    setBillId('');

    let opened = false;

    if (invoiceType === 'gstinvoice') {
      opened = await handleGSTBill();
    } else if (invoiceType === 'urd/purchase-invoice') {
      opened = await handleURDPurchaseBill();
    } else if (invoiceType === 'urd/sales-invoice') {
      opened = await handleURDSalesBill();
    } else {
      alert('Invalid Invoice Type');
      return;
    }

    // If the server returned a document URL (opened === true) OR we have a
    // client-generated preview (`previewUrl`), force a remount and show the
    // modal. This allows the preview flow to work even when the backend
    // doesn't return a hosted URL (for example, when preview is produced
    // client-side).
    if (opened || previewUrl) {
      setModalKey((k) => k + 1);
      setShowPdfModal(true);
    } else {
      // Provide feedback when neither server preview nor client preview exists
      setTopAlert({ show: true, type: 'error', message: 'Failed to generate bill preview. Please try again.', position: 'top-center' });
    }
  };

  const generateEway = () => {
    navigate(`/EWayBillRequest?billid=${billId}`);
    dispatch(clearGSTDetails());
  };

  const createNewBill = () => {
    handleCloseModalAndClear();
    if (invoiceType === 'gstinvoice') {
      navigate('/gst-invoice');
    } else {
      navigate('/urd-invoice');
    }
  };

  // Share handler: per user request, only force download and show bottom-right toast
  const handleShare = async () => {
    if (!previewUrl) {
      setTopAlert({ show: true, type: 'error', message: 'No invoice available to share.', position: 'bottom-right' });
      return;
    }

    // Helper: fetch blob from previewUrl
    const fetchPdfBlob = async () => {
      const resp = await fetch(previewUrl, { cache: 'no-store' });
      if (!resp.ok) throw new Error(`Failed to fetch preview for share/download: ${resp.status}`);
      const arrayBuffer = await resp.arrayBuffer();
      return new Blob([arrayBuffer], { type: 'application/pdf' });
    };

    try {
      const pdfBlob = await fetchPdfBlob();

      // Option 1: Try sharing the file directly (mobile/Chromium with file sharing)
      if (navigator.canShare && navigator.canShare({ files: [new File([pdfBlob], 'invoice.pdf', { type: 'application/pdf' })] }) && navigator.share) {
        try {
          const file = new File([pdfBlob], `invoice_${Date.now()}.pdf`, { type: 'application/pdf' });
          await navigator.share({ files: [file], title: 'Invoice', text: 'Please find the invoice attached.' });
          setTopAlert({ show: true, type: 'success', message: 'Invoice shared successfully.', position: 'top-center' });
          return;
        } catch (err) {
          console.warn('[share] native file share failed, falling back to URL share:', err);
          // continue to next option
        }
      }

      // Option 2: Try sharing via URL (some browsers support sharing URLs even if file share unsupported)
      if (navigator.share) {
        try {
          // ensure previewUrl is a blob/object URL reachable by the page
          await navigator.share({ title: 'Invoice', text: 'View the invoice', url: previewUrl });
          setTopAlert({ show: true, type: 'success', message: 'Invoice shared successfully.', position: 'top-center' });
          return;
        } catch (err) {
          console.warn('[share] navigator.share with URL failed, will fallback to download:', err);
          // continue to next option
        }
      }

      // Option 3: Fallback -> force download and show bottom-right toast advising to use Chromium browsers for native sharing
      const downloadUrl = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `invoice_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(downloadUrl);

      setTopAlert({
        show: true,
        type: 'warning',
        message: "This browser doesn't support native file sharing — the invoice has been downloaded. Use a Chromium-based browser (Chrome/Edge) to share files directly.",
        position: 'bottom-right'
      });

    } catch (err) {
      console.error('[share] all share/download attempts failed:', err);
      setTopAlert({ show: true, type: 'error', message: 'Failed to share or download invoice. Please try again.', position: 'bottom-right' });
    }
  };

  // Export invoice as Word (.doc) by building a simple HTML wrapper and forcing download
  const exportAsWord = () => {
    if (!previewUrl) {
      alert('No invoice available to export');
      return;
    }

    const html = `<!doctype html><html><head><meta charset=\"utf-8\"><title>Invoice</title></head><body><iframe src=\"${previewUrl}\" style=\"width:100%;height:100%\"></iframe></body></html>`;
    const blob = new Blob([html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice_${Date.now()}.doc`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // Export invoice as image(s) by rendering the PDF into canvas using pdfjs-dist
  const exportAsImage = async (format = 'png') => {
    if (!previewUrl) {
      alert('No invoice available to export');
      return;
    }

    try {
      // Use CDN worker to avoid bundling issues with CRA
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const loadingTask = pdfjsLib.getDocument(previewUrl);
      const pdf = await loadingTask.promise;

      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      const renderContext = {
        canvasContext: context,
        viewport,
      };

      await page.render(renderContext).promise;

      const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      canvas.toBlob((blob) => {
        if (!blob) {
          alert('Failed to generate image');
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${Date.now()}.${format === 'jpeg' ? 'jpg' : 'png'}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }, mime, 0.95);
    } catch (err) {
      console.error('Error exporting as image:', err);
      alert('Failed to export invoice as image.');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full p-8 lg:space-x-6">
      {topAlert.show && (
        <TopAlert
          type={topAlert.type}
          message={topAlert.message}
          position={topAlert.position}
          onClose={() => setTopAlert({ ...topAlert, show: false })}
        />
      )}

      <div className="flex-1 p-6 bg-white border rounded-xl shadow-xl overflow-hidden mt-2 dark:bg-gray-800 dark:border-gray-700">
        <div className="text-2xl font-bold text-gray-800 mb-3 dark:text-gray-200">Invoice Preview</div>
        <div className="flex justify-center">
          <iframe title="invoice-preview" src={previewUrl} className="w-3/4 h-[80vh] border border-gray-300 rounded-lg" />
        </div>
      </div>

      <div className="w-full lg:w-1/3 h-auto p-6 bg-white border rounded-xl shadow-xl overflow-hidden flex flex-col items-center mt-2 dark:bg-gray-800 dark:border-gray-700">
        <div className="text-2xl font-bold text-gray-800 mb-3 dark:text-gray-200">Customize Invoice</div>

        <div className="w-full max-w-sm mb-6">
          <label className="block text-gray-700 text-xl font-bold mb-2 dark:text-gray-200">Select Template</label>
          <select value={selectedTemplate} onChange={handleTemplateChange} className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {Object.keys(templates).map((key) => (
              <option key={key} value={key}>{`Template ${key.charAt(key.length - 1)}`}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col space-y-4 w-full">
          <button className="px-6 py-3 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200 dark:bg-blue-800 dark:text-gray-200 dark:hover:bg-blue-700 dark:border-blue-800" onClick={addBill}>Generate Invoice</button>
          <button className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200" onClick={() => navigate('/gst-invoice')}>Edit Invoice</button>
        </div>

        <ActionModal
          key={modalKey}
          isOpen={showPdfModal}
          onClose={handleSimpleCloseModal}
          onGenerateEway={generateEway}
          onCreateNewBill={createNewBill}
          onDownloadbill={handleDownloadPDF}
          onShareInvoice={handleShare}
          onExportWord={exportAsWord}
          onExportImage={exportAsImage}
          invoiceType={invoiceType}
          billId={billId}
          forceShowShare={process.env.NODE_ENV !== 'production'}
        />

      </div>
    </div>
  );
};

export default InvoicePage;
