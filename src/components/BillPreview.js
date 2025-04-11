import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import numberToWords from "number-to-words";
import Template1 from "../billtemplates/Template1";
import Template2 from "../billtemplates/Template2";


const BillPreview = ({ open, onClose, ewaybillData, billData }) => {
  const [invoiceData, setInvoiceData] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("template1");

  const templates = {
    template1: Template2,
  };

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

    calculatedData.totalTaxableAmount = overallTotalTaxableAmount.toFixed(2);
    calculatedData.totalTax = overallTotalTax.toFixed(2);
    calculatedData.totalAmount = overallTotalAmount.toFixed(2);
    calculatedData.totalCGSTTax = overallTotalCGSTTax.toFixed(2);
    calculatedData.totalSGSTTax = overallTotalSGSTTax.toFixed(2);
    calculatedData.cgstRate = cgst;
    calculatedData.sgstRate = sgst;
    calculatedData.totalQuantity = totalQuantity;
    calculatedData.unit = overallUnit;

    if (!isNaN(overallTotalAmount) && isFinite(overallTotalAmount)) {
      calculatedData.totalAmountInWords =
        numberToWords.toWords(Math.floor(overallTotalAmount)).replace(/\b\w/g, (char) => char.toUpperCase()) +
        " Rupees Only";
    } else {
      console.error("Error: Invalid total amount for conversion:", overallTotalAmount);
      calculatedData.totalAmountInWords = "Invalid Amount";
    }

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

  /* 

    Eway Bill Response 

    {
      "url": "https://eways.s3.ap-south-1.amazonaws.com/67c48dd020331.pdf",
      "eway_no": 351010262372,
      "vehicle_no": "UP78GN3045",
      "legal_name": "NEERAJ  KUMAR",
      "trade_name": "M/S NEERAJ INDUSTRIES",
      "bill": {
          "paymentStatus": {
              "status": "paid",
              "amountReceived": 0,
              "lastDateOfPayment": null,
              "nextPaymentDate": null,
              "updated_at": "2025-03-02T16:50:26.914Z"
          },
          "_id": "67c48dd8263bb43a1bcd9149",
          "first_party": "05AAACH6188F1ZM",
          "sn_no": "74",
          "hsns": [
              {
                  "hsn_code": 7801,
                  "product_info": "UNWROUGHT LEAD",
                  "cgst": "9",
                  "sgst": "9",
                  "unit": "Kgs"
              }
          ],
          "products": [
              "UNWROUGHT LEAD"
          ],
          "rate": [
              172
          ],
          "quantity": [
              88
          ],
          "second_party": "05AAACH6886N1Z0",
          "gst_rate": [
              {
                  "cgst": "9",
                  "sgst": "9"
              }
          ],
          "shipping_address": {
              "address1": "E 83/A, Panki Site 5",
              "address2": "Kanpur Nagar",
              "pincode": 263680,
              "city": "Kanpur",
              "state": "UP",
              "country": "IN"
          },
          "eway_status": "done",
          "paymentType": "cash",
          "created_at": "2025-03-02T16:56:56.498Z",
          "downloadlink": "https://pdfstoregst.s3.ap-south-1.amazonaws.com/67c48dd8263bb43a1bcd9149.pdf",
          "__v": 0
      }
    }

   Transactions Response (One object from the Array)
   {
            "_id": "67d3101785e0b5dd24bc4cdd",
            "first_party": "14ABGDE3456F7ZQ",
            "sn_no": "92",
            "second_party": "09AMYPK1749C1ZO",
            "trade_name": "M/S NEERAJ INDUSTRIES",
            "legal_name": "NEERAJ  KUMAR",
            "created_at": "2025-03-13 22:34:23",
            "hsns": [
                {
                    "hsn_code": "8512",
                    "product_info": "ELECTRICAL LIGHTING",
                    "cgst": "9",
                    "sgst": "9",
                    "unit": "Pcs"
                }
            ],
            "products": [
                "ELECTRICAL LIGHTING"
            ],
            "rate": [
                150
            ],
            "quantity": [
                10
            ],
            "gst_rate": [
                {
                    "cgst": "9",
                    "sgst": "9"
                }
            ],
            "downloadlink": "https://pdfstoregst.s3.ap-south-1.amazonaws.com/67d3101785e0b5dd24bc4cdd.pdf",
            "generated": true,
            "total_value": "1770.00",
            "tax_value": "270.00",
            "name": "NEERAJ  KUMAR",
            "eway_status": "left"
    },

  */

  useEffect(() => {


     const createEwayBillPreview = (ewaybillData) =>{

      const date = new Date(ewaybillData.bill.created_at);

      const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;

      const invoiceDataFromGlobal = {
        firstParty: {
          gstin: business ? business.gstin : '',
          legal_name: business ? business.legal_name: '',
          trade_name: business ? business.trade_name: '',
          principal_address: business ? business.principal_address: '',
          shipping_address: business ? business.shipping_address: ''
        },
        party: {
          gstin: ewaybillData.bill ? ewaybillData.bill.second_party : '',
          legal_name:  ewaybillData.bill ?  ewaybillData.legal_name : '',
          trade_name:  ewaybillData.bill ? ewaybillData.trade_name:'',
          principal_address: ewaybillData.bill ?  ewaybillData.bill.shipping_address:'',
          shipping_address: ewaybillData.bill ?  ewaybillData.bill.shipping_address:'',
          invoiceDate:formattedDate || '',
          invoiceNo: ewaybillData.bill ? ewaybillData.bill.sn_no : '',
          phoneNo: '',
        },
        quantities: ewaybillData.bill.quantity.map((q) => q),
        hsn_details: ewaybillData.bill.hsns.map((hsn) => ({
          hsn_code: hsn.hsn_code,
          product_info: hsn.product_info,
          cgst: hsn.cgst,
          sgst: hsn.sgst,
          unit: hsn.unit,
        })),
        rates: ewaybillData.bill.rate.map((r) => r),
        tandc: GSTtandcDetails,
        signature: signature,
        stamp: stamp,
        logo:logo,
        qr:qr,
        bank: selectedGBank,
        signatureEnabled:signatureEnabled,
        stampEnabled:stampEnabled,
        bankEnabled:bankEnabled,
        attestationSelection:attestationSelection,
        ewayNumber:ewaybillData.eway_no,
        vehicleNumber:ewaybillData.vehicle_no
      };

      const calculatedInvoice = calculateInvoiceTotals(invoiceDataFromGlobal);
      setInvoiceData(calculatedInvoice);
      generatePreview(calculatedInvoice);
     }

     const createBillPreview = (billData) =>{

        const invoiceDataFromGlobal = {
          firstParty: {
            gstin: business ? business.gstin : '',
            legal_name: business ? business.legal_name: '',
            trade_name: business ? business.trade_name: '',
            principal_address: business ? business.principal_address: '',
            shipping_address: business ? business.shipping_address: ''
          },
          party: {
            gstin:  billData.second_party ? billData.second_party : '',
            legal_name:  billData.legal_name ? billData.legal_name : billData.name || '',
            trade_name:  billData.trade_name ? billData.trade_name : billData.name || '',
            principal_address:  billData.billedTo ? billData.billedTo : '',
            shipping_address:  billData.shipping_address ? billData.shipping_address : '',
            invoiceDate: billData.created_at.split(" ")[0],
            invoiceNo: billData.sn_no,
            phoneNo: '',
          },
          quantities: billData.quantity.map((q) => q),
          hsn_details: billData.hsns.map((row,index) => ({
            hsn_code: row.hsn_code ? row.hsn_code : row,
            product_info: row.product_info ? row.product_info : billData.products[index],
            cgst: row.cgst ? row.cgst : '',
            sgst: row.sgst ? row.sgst : '',
            unit: row.unit ? row.unit : '',
          })),
          rates: billData.rate.map((price) => price),
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

      if(ewaybillData){
        createEwayBillPreview(ewaybillData);
      }else if(billData){
        createBillPreview(billData);
      }

  }, [ewaybillData, selectedTemplate, billData]);

  const handleTemplateChange = (e) => {
    setSelectedTemplate(e.target.value);
  };

  const handleDownloadPDF = () => {
    if (!previewUrl) {
      alert("No Items are added");
      return;
    }

    const BillTemplate = templates[selectedTemplate] || Template1;
    const billTemplate = new BillTemplate();
    const doc = billTemplate.generateInvoice(invoiceData);
    const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
    const uniqueName = `invoice_${timestamp}.pdf`;
    doc.save(uniqueName);
  };

  return (
    <div className={`mt-16 fixed inset-0 flex items-center justify-center bg-opacity-50 ${open ? "block" : "hidden"}`}>
      <div className="bg-white border border-gray p-5 rounded-lg shadow-lg w-full max-w-4xl dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold dark:text-gray-200">Invoice Preview</h2>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition duration-200 dark:bg-red-800 dark:text-gray-200 dark:hover:bg-red-700 dark:border-red-800"
          >
            Close
          </button>

        </div>
        <div className="flex justify-center">
          <iframe
            title="invoice-preview"
            src={previewUrl}
            className="w-full h-[70vh] border border-gray-300 rounded-lg"
          />
        </div>
        <div className="flex justify-between mt-4">
          <div>
            <label className="text-xl font-bold dark:text-gray-200">Select Template</label>
            <select
              value={selectedTemplate}
              onChange={handleTemplateChange}
              className="ml-2 px-3 py-2 border rounded"
            >
              {Object.keys(templates).map((key) => (
                <option key={key} value={key}>{`Template ${key.charAt(key.length - 1)}`}</option>
              ))}
            </select>
          </div>
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-800 dark:text-gray-200 dark:hover:bg-blue-700 dark:border-blue-800"
            onClick={handleDownloadPDF}
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillPreview;
