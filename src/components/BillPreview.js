import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import numberToWords from "number-to-words";
import Template1 from "../billtemplates/Template1";


const BillPreview = ({ open, onClose, ewayBillData, billdata }) => {
  const [invoiceData, setInvoiceData] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("template1");

  const templates = {
    template1: Template1,
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
    let overallTotalTaxableAmount = 0;
    let overallTotalAmount = 0;

    calculatedData.hsn_details.forEach((item, index) => {
      const quantity = Number(calculatedData.quantities[index]) || 0;
      const unitPrice = Number(calculatedData.rates[index]) || 0;
      const cgstRate = parseFloat(item.cgst) || 0;
      const sgstRate = parseFloat(item.sgst) || 0;
      const taxRate = cgstRate + sgstRate;

      const taxableAmount = unitPrice * quantity;
      const taxPerUnit = (unitPrice * taxRate) / 100;
      const totalTax = taxPerUnit * quantity;
      const totalAmount = taxableAmount + totalTax;

      item.taxableAmount = taxableAmount.toFixed(2);
      item.totalTax = totalTax.toFixed(2);
      item.totalAmount = totalAmount.toFixed(2);

      overallTotalTaxableAmount += taxableAmount;
      overallTotalTax += totalTax;
      overallTotalAmount += totalAmount;
    });

    calculatedData.totalTaxableAmount = overallTotalTaxableAmount.toFixed(2);
    calculatedData.totalTax = overallTotalTax.toFixed(2);
    calculatedData.totalAmount = overallTotalAmount.toFixed(2);

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
  */

  useEffect(() => {

     if (ewayBillData) {

        const date = new Date(ewayBillData.bill.created_at);

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
            gstin: ewayBillData.bill.second_party,
            legal_name:  ewayBillData.legal_name,
            trade_name: ewayBillData.trade_name,
            shipping_address: ewayBillData.bill.shipping_address,
            invoiceDate: formattedDate,
            invoiceNo:ewayBillData.bill.sn_no,
            phoneNo: '',
          },
          quantities: ewayBillData.bill.quantity.map((q) => q),
          hsn_details: ewayBillData.bill.hsns.map((hsn) => ({
            hsn_code: hsn.hsn_code,
            product_info: hsn.product_info,
            cgst: hsn.cgst,
            sgst: hsn.sgst,
            unit: hsn.unit,
          })),
          rates: ewayBillData.bill.rate.map((r) => r),
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
          ewayNumber:ewayBillData.eway_no,
          vehicleNumber:ewayBillData.vehicle_no
        };
  
        const calculatedInvoice = calculateInvoiceTotals(invoiceDataFromGlobal);
        setInvoiceData(calculatedInvoice);
        generatePreview(calculatedInvoice);

      }

  }, [ewayBillData, selectedTemplate]);

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
    const uniqueName = `eway-added-invoice_${timestamp}.pdf`;
    doc.save(uniqueName);
  };

  return (
    <div className={`mt-16 fixed inset-0 flex items-center justify-center bg-opacity-50 ${open ? "block" : "hidden"}`}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Invoice Preview</h2>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition duration-200"
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
            <label className="text-xl font-bold">Select Template</label>
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
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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
