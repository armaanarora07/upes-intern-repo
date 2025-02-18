import React, { useState ,useEffect } from "react";
import { FaFileAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Additem from "../assets/Additem.png";
import Share from "../assets/Share.png";
import Download from "../assets/Download.png";
import Select from "../assets/Select.png";
import Next from "../assets/Next.png";
import TemplateModal from "./TemplateModal";
import { useSelector } from "react-redux";
import axios from 'axios';

const createRow = (id) => ({
  id: id,
  product_info: "",       // Add product_info
  hsn_code: "",           // Add hsn_code
  quantity: "",
  unit: "KG",
  price: "",
  taxPercent: "",
  taxAmount: 0,          // Initialize as a number
  amount: 0,             // Initialize as a number
  cgst: "",               // Add cgst
  sgst: "",               // Add sgst
  rate: "",               // Add rate if it's relevant
});


const GstInvoice = () => {
  const [GST, setGST] = useState('');
  const [status, setStatus] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [rows, setRows] = useState([createRow(1)]);
  const [showModal, setShowModal] = useState(false);
  const [isRightEnabled, setIsRightEnabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [tradeName, setTradeName] = useState("");
  const [legalName, setlegalName] = useState("");
  const [paddress1, setpAddress1] = useState("");
  const [paddress2, setpAddress2] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [city, setcity] = useState("");
  const [country, setcountry] = useState("");
  const [saddress1, setsAddress1] = useState("");
  const [saddress2, setsAddress2] = useState("");
  const [spincode, setSPincode] = useState("");
  const [sstate, setSState] = useState("");
  const [scity, setScity] = useState("");
  const [scountry, setScountry] = useState("");
  const [billNo, setBillNo] = useState([]); // State for the bill number
  const authToken = useSelector((state) => state.auth.authToken); // access from global auth state 

  useEffect(() => {
    const fetchBillNumber = async () => {
  
      if (!authToken) {
        alert("Authorization token is missing. Please log in again.");
        return;
      }

      try {
        const response = await fetch(
          "/user/mySnNo?gstin=09CYLPR6774F1ZN", 
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (response.ok) {
          
          const data = await response.json();
          console.log(data);
          // setBillNo(data.bill_no || data.serial_no || ""); 
          const fetchedBillNumbers = Array.isArray(data.sn_no)
            ? data.sn_no
            : data.sn_no
            ? [data.sn_no] // Wrap single value in an array
            : [];
          console.log(fetchedBillNumbers)
          setBillNo(fetchedBillNumbers)
        } else {
          alert("Failed to fetch bill number.");
          
        }
        
      } catch (error) {

        console.error("Error fetching bill number:", error);
        alert("An error occurred while fetching the bill number.");
      }
    };

    fetchBillNumber();
  }, []); 

  const addRow = () => {
    setRows([...rows, createRow(rows.length + 1)]);
  };

  const handleInputChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
  
    

    // Update amounts when price, quantity, or tax changes
    if (["quantity", "price", "taxPercent", "cgst", "sgst", "igst"].includes(field)) {
      const quantity = Number(newRows[index].quantity);
      const price = Number(newRows[index].price); // Convert to number
      const taxPercent = Number(newRows[index].taxPercent);
  
      const amount = quantity * price; // Base amount (before tax)
      const taxAmount = (amount * taxPercent) / 100; // Calculate total tax
  
      // Assuming CGST and SGST split the tax amount equally if applicable
      const cgst = taxPercent / 2; 
      const sgst = taxPercent / 2; 
      const igst = taxPercent; // For inter-state transactions
  
      // Update values in the row
      newRows[index].taxAmount = taxAmount.toFixed(2); // Total tax amount
      newRows[index].amount = (amount + taxAmount).toFixed(2); // Total amount including tax
      newRows[index].cgst = cgst.toFixed(2);
      newRows[index].sgst = sgst.toFixed(2);
      newRows[index].igst = igst.toFixed(2); // Depending on whether inter-state tax applies
  
      // Update taxable amount (amount before tax)
      newRows[index].taxableAmount = amount.toFixed(2);
    }
  
    setRows(newRows);
  };
  
  

  const totalQuantity = rows.reduce(
    (sum, row) => sum + (Number(row.quantity) || 0), // Ensure quantity is a number or 0
    0
  );
  const totalTax = rows.reduce(
    (sum, row) => sum + (Number(((Number(row.quantity) * Number(row.price) * Number(row.taxPercent)) / 100).toFixed(2)) || 0), // Ensure tax calculation is valid
    0
  );
  const totalAmount = rows.reduce(
    (sum, row) => sum + (Number(row.amount) || 0), // Ensure amount is a number or 0
    0
  );

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setIsModalOpen(false);
  };

  const downloadPDF = async () => {
    
    if (!authToken) {
      alert("Authorization token is missing. Please log in again.");
      return;
    }
  
    // Check your rows structure
    console.log("Rows data:", rows);
  
    const body = {
      party: {
        gstin: GST,
        legal_name: legalName,
        trade_name: tradeName,
        principal_address: {
          address1: paddress1,
          address2: paddress2,
          pincode: pincode,
          city: city,
          state: state,
          country: country,
        },
        shipping_address: {
          address1: saddress1,
          address2: saddress2,
          pincode: spincode,
          city: scity,
          state: sstate,
          country: scountry,
        },
      },
      quantities: rows.map((row) => row.quantity),
      hsn_details: rows.map((row) => {
        console.log("Row details:", row); // Debugging line
        return {
          hsn_code: row.hsn_code,           // Ensure this field exists in your row
          product_info: row.product_info,   // Ensure this field exists in your row
          cgst: row.cgst,                   // Ensure this field exists in your row
          sgst: row.sgst,
          igst: row.igst,                   // Ensure this field exists in your row
          unit: row.unit                     // Ensure this field exists in your row
        };
      }),
      rates: rows.map((row) => row.price),
    };
  
    try {
      const response = await fetch(
        "/user/bill",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(body),
        }
      );
  
      if (response.ok) {
        const result = await response.json();
        const downloadUrl = result.url;
        if (downloadUrl) {
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.download = "invoice.pdf";
          link.click();
          alert("PDF is downloading...");
        } else {
          alert("Download URL is missing in the response.");
        }
      } else {
        alert("Failed to generate PDF. Please try again.");
        console.error(`Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      alert("An error occurred while downloading the PDF.");
      console.error(error);
    }
  };

  const handleVerify = async (gstNumber) => {
    if (!gstNumber) {
      alert('Enter a Valid GST Number');  // Alerting the user to enter the valid gst number before verifying
      return;
    }

    try {
      const response = await axios.get(`https://fyntl.sangrahinnovations.com/user/validategst?gst=${gstNumber}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = response.data;

      if (response.statusText === 'OK') {
        setlegalName(data.data?.legal_name || '');
        setTradeName(data.data?.trade_name || '');
        setpAddress1(data.data?.principal_address.address1 || '');
        setpAddress2(data.data?.principal_address.address2 || '');
        setPincode(data.data?.principal_address.pincode || '');
        setState(data.data?.principal_address.state || '');
        setcity(data.data?.principal_address.city || '');
        setcountry(data.data?.principal_address.country || '');
        setsAddress1(data.data?.shipping_address.address1 || '');
        setsAddress2(data.data?.shipping_address.address2 || '');
        setSPincode(data.data?.shipping_address.pincode || '');
        setSState(data.data?.shipping_address.state || '');
        setScity(data.data?.shipping_address.city || '');
        setScountry(data.data?.shipping_address.country || '');
        setIsVerified(true);
        setStatus(true);
      } else {
        console.error('Verification failed:', data);
        console.error('Status:', response.status);
        console.error('Status Text:', response.statusText);
        setIsVerified(false);
        setStatus(true);
      }
    } catch (error) {
      console.error('Error during verification:', error);
      setIsVerified(false);
      setStatus(true);
    }
  };

  const handleSameAsShipping = () => {
    setIsRightEnabled(true);
    setsAddress1(paddress1);
    setSPincode(pincode);
    setSState(state);
  };

  // Add this function to format GST number
  const formatGSTNumber = (gst) => {
    return gst.toUpperCase().trim(); // Convert to uppercase and trim whitespace
  };

  return (
    <div className="p-6">

      <div className="flex justify-between">

      <div className="flex items-center space-x-3 text-[#4154f1] font-bold text-3xl mb-6">
        <FaFileAlt className="text-4xl" />
        <span>Generate New GST Bill</span>
      </div>

      <button
        className="flex items-center font-medium text-lg px-4 py-2 bg-[#4154f1] rounded-lg mr-6 mt-8 text-white"
        onClick={() => setIsModalOpen(true)}
      >
        <i className="fas fa-arrow-right"></i>
        Select Template
        {/* <img src={Select} alt="logo" className="ml-2 w-[1.2rem]"></img> */}
      <FaFileAlt className="text-white ml-2 w-[1.2rem] mr-4" />
      </button>

      </div>
      <div className="text-xl sm:pl-4 sm:text-2xl mt-2 font-medium">
        Buyer's Details
      </div>
      <div className="flex space-x-12 ">
        <div className="w-2/5 p-2 relative ">
          <div className="space-y-4 relative mt-4">
            {/* Input 1 */}
            <div className="relative mb-4">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                GSTIN
              </span>
              <input
                type="text"
                value={GST} // Controlled input
                onChange={(e) => {
                  const formattedGST = formatGSTNumber(e.target.value);
                  setGST(formattedGST); // Update state with formatted GST

                  // Automatically verify if the GST number is 15 digits
                  if (formattedGST.length === 15) {
                    handleVerify(formattedGST); // Call the verification function
                  }
                }} // Update state on input change with formatting
                className="w-full border border-[#4154f1] rounded-lg p-2"
              />
              {/* Verification Status Indicator */}
              {status && (isVerified ? (
                <span className="absolute right-2 top-2 text-green-500">
                  <FaCheckCircle /> {/* Green tick icon */}
                </span>
              ) : (
                <span className="absolute right-2 top-2 text-red-500">
                  <FaTimesCircle /> {/* Red error icon */}
                </span>
              ))}
              
            </div>
            <div className="relative mb-4">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                Name
              </span>
              <input
                type="text"
                value={tradeName} // Controlled input
                onChange={(e) => setTradeName(e.target.value)} // Update state on input change
                className="w-full border border-[#4154f1] rounded-lg p-2"
              />
            </div>

            {/* Input 2 */}
            <div className="relative">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                Phone No
              </span>
              <input
                type="text"
                className="w-full border border-[#4154f1] rounded-lg p-2"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex space-x-2">
        {/* Left Section */}
        <div className="w-2/5 p-2 relative">
          <span> Address Type </span>
          <div className="space-y-4 relative mt-4">
            <div className="relative mb-4">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                Address
              </span>
              <input
                type="text"
                value={paddress1} 
                onChange={(e) => setpAddress1(e.target.value)} 
                className="w-full border border-[#4154f1] rounded-lg p-2"
              />
            </div>

            {/* Input 2 */}
            <div className="relative">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                City PinCode
              </span>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)} 
                className="w-full border border-[#4154f1] rounded-lg p-2"
              />
            </div>
            <div className="relative">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                State
              </span>
              <input
                type="text"
                value={state} 
                onChange={(e) => setState(e.target.value)} 
                className="w-full border border-blue-500 rounded-lg p-2"
              />
            </div>
          </div>
        </div>

        <div className="w-2/5 p-2 relative">
          <label className="flex items-center mb-4">
            <input
              type="radio"
              name="section"
              className="mr-2 text-black accent-blue-500"
              onChange={handleSameAsShipping}
            />
            <span>Same as shipping address</span>
          </label>
          {/* Input Fields for Right Section */}
          <div className="space-y-4 relative">
            {/* Input 1 */}
            <div className="relative">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                Address
              </span>
              <input
                type="text"
                value={saddress1} 
                onChange={(e) => setsAddress1(e.target.value)}
                className="w-full border border-[#4154f1] rounded-lg p-2"
              />
            </div>
            {/* Input 2 */}
            <div className="relative">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                City Pincode
              </span>
              <input
                type="text"
                value={spincode}
                onChange={(e) => setSPincode(e.target.value)}
                className="w-full border border-[#4154f1] rounded-lg p-2"
              />
            </div>
            {/* Input 3 */}
            <div className="relative">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                State
              </span>
              <input
                type="text"
                value={sstate} 
                onChange={(e) => setSState(e.target.value)} 
                className="w-full border border-[#4154f1] rounded-lg p-2"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="p-5 text-[#3D3F4B] ">
      <div className="flex justify-between">
        <h2 className="text-[1.6rem] text-black font-medium mb-4 ">Items Details</h2>
        {/* Edit/Add Items Button */}
        <button
          onClick={addRow}
          className="flex items-center text-lg gap-2 px-3 py-[0.35rem] border text-black  border-black font-medium rounded-md shadow-md mb-4 "
        >
          <img src={Additem} alt="logo"></img>
          Edit/Add Items
        </button>
        </div>
        {/* Row Items Table */}
        <div className="w-full ">
          <table className="min-w-full bg-[#F9FAFC] shadow-md">
  <thead className="bg-gray-100 text-[#51535e] ">
    <tr>
      <th className="border-b-2 border-r-2 border-black text-black font-medium text-lg w-16" rowSpan="2">S No.</th>
      <th className="border-b-2 border-r-2 border-black  text-black font-medium text-lg w-80" rowSpan="2">Item Name</th>
      <th className="border-b-2 border-r-2 border-black  text-black font-medium text-lg w-28" rowSpan="2">HSN Code</th>
      <th className="border-b-2 border-r-2 border-black  text-black font-medium text-lg w-28" rowSpan="2">Quantity</th>
      <th className="border-b-2 border-r-2 border-black text-black font-medium text-lg w-28" rowSpan="2">Unit</th>
      <th className="border-b-2 border-r-2 border-black text-black font-medium text-lg w-40" rowSpan="2">Price</th>
      <th className="border-b-2 border-r-2 border-black text-black font-medium text-lg w-36" colSpan="2">Tax (%)</th>
      <th className="border-b-2 border-black font-medium text-black text-lg w-36" rowSpan="2">Amount</th>
    </tr>
    <tr>
      <th className="border-b-2 border-r-2 border-black text-black font-normal text-lg">Percent (%)</th>
      <th className="border-b-2 border-r-2 border-black text-black font-normal text-lg">Amount</th>
    </tr>
  </thead>
   <tbody>
    {rows.map((row, index) => (
      <tr key={index} className="border-t">
        <td className="p-1 border-r-2 border-black text-center">{index + 1}</td>
        <td className="p-1 border-r-2 border-black">
          <input
            type="text"
            className="border-2 border-[#EFF0F4] p-2 w-full rounded-md "
            placeholder="Item Name"
            value={row.product_info}
            onChange={(e) => handleInputChange(index, "product_info", e.target.value)}
          />
        </td>
        <td className="p-1 border-r-2 border-black">
          <input
            type="text"
            className="border-2 border-[#EFF0F4] p-2 w-full rounded-md "
            placeholder="HSN Code"
            value={row.hsn_code}
            onChange={(e) => handleInputChange(index, "hsn_code", e.target.value)}
          />
        </td>
        <td className="p-1 border-r-2 border-black">
          <input
            type="number"
            className="border-2 border-[#EFF0F4] p-2 w-full rounded-md "
            placeholder="Qty"
            value={row.quantity}
            onChange={(e) => handleInputChange(index, "quantity", Number(e.target.value))}
          />
        </td>
        <td className="p-1 border-r-2 border-black">
          <select
            className="border-2 border-[#EFF0F4] p-2 w-full rounded-md "
            value={row.unit}
            onChange={(e) => handleInputChange(index, "unit", e.target.value)}
          >
            <option value="KG">KG</option>
            <option value="L">L</option>
            <option value="PCS">PCS</option>
          </select>
        </td>
        <td className="p-1 border-r-2 border-black">
          <input
            type="number"
            className="border-2 border-[#EFF0F4] p-2 w-full rounded-md "
            placeholder="Price"
            value={row.price}
            onChange={(e) => handleInputChange(index, "price", Number(e.target.value))}
          />
        </td>
        <td className="p-1 border-r-2 border-black">
          <input
            type="number"
            className="border-2 border-[#EFF0F4] p-2 w-full rounded-md "
            placeholder="Tax %"
            value={row.taxPercent}
            onChange={(e) => handleInputChange(index, "taxPercent", Number(e.target.value))}
          />
        </td>
        <td className="p-1 border-r-2 border-black">
          <input
            type="number"
            className="border-2 border-[#EFF0F4] p-2 w-full rounded-md "
            placeholder="Tax Amount"
            value={row.taxAmount}
            readOnly
          />
        </td>
        <td className="p-1">
          <input
            type="number"
            className="border-2 border-[#EFF0F4] p-2 w-full rounded-md "
            placeholder="Amount"
            value={row.amount}
            readOnly
          />
        </td>
      </tr>  
      ))}
     <tr className="font-semibold bg-[#989baaa7] text-black">
                <td colSpan="3" className="p-3 text-right border-r-2 border-black">
                  TOTAL
                </td>
                <td className="p-3 border-r-2 border-black text-right">
                  {totalQuantity}
                </td>
                <td className="p-3 border-r-2 border-black text-right"></td>
                <td className="p-3 border-r-2 border-black text-right"></td>
                <td className="p-3 border-r-2 border-black text-right"></td>
                <td className="p-3 border-r-2 border-black text-right">
                  {totalTax.toFixed(2)}
                </td>
                <td className="p-3 text-right">{totalAmount}</td>
              </tr>

       </tbody>
      </table>

        </div>
        <div className="flex items-start justify-end">
          {/* Next Button to open the modal */}
          {/* <button
            className="flex items-center font-medium text-lg px-4 py-2 bg-[#4154f1] rounded-lg mr-6 mt-8 text-white"
            onClick={() => setIsModalOpen(true)}
          >
            <i className="fas fa-arrow-right"></i>
            Select Template
            <img src={Select} alt="logo" className="ml-2 w-[1.2rem]"></img>
          </button> */}

          {/* Next Button to open the modal */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center font-semibold text-xl  border border-[#4154f1] px-4 py-2 bg- rounded-[10px] mr-6 mt-4 text-[#4154f1]"
          >
            <i className="fas fa-arrow-right"></i>
            Next
            <img src={Next} alt="logo" className="ml-2 w-5"></img>
          </button>
           <div className="text-right">
          <button
            onClick={downloadPDF}
            className="bg-[#4154f1] text-white text-xl px-4 py-2 rounded-lg mt-4"
          >
            Generate PDF
          </button>
        </div> 
        </div>

        <TemplateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelect={handleTemplateSelect}
        />
        {selectedTemplate && (
          <div className="mt-4">
            <h4 className="text-lg font-semibold">
              Selected Template: {selectedTemplate.bill_id}
            </h4>
          </div>
        )}
        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
            <div className="relative bg-white rounded-lg shadow-lg shadow-blue-200 px-12 py-7">
              {/* Close (X) Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-600 transition-transform duration-300 ease-in-out transform hover:rotate-90"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Modal Content */}
              <div className="space-y-4 p-4 flex flex-col items-start">
                <div className="flex">
                  <img
                    src={Download}
                    alt="Download icon"
                    className="mr-3 w-9 h-9 mt-[0.1rem]"
                  />
                  <button
                    onClick={downloadPDF}
                    className="flex items-center gap-2 px-4 py-2 text-[#1436FF] bg-[#EFF2FF] rounded-full hover:bg-[#DDE6FF] transition-all"
                  >
                    Download as PDF
                  </button>
                </div>
                <div className="flex">
                  <img
                    src={Share}
                    alt="Share icon"
                    className="mr-3 w-9 h-9 mt-[0.1rem]"
                  />
                  <button
                    onClick={() => alert("Share")}
                    className="flex items-center gap-2 px-4 py-2 text-[#1436FF] bg-[#EFF2FF] rounded-full hover:bg-[#DDE6FF] transition-all"
                  >
                    Share
                  </button>
                </div>
                
              </div>
            </div>
          </div>
        )}

        {/* Generate Bill Section */}
        {/* <div className="text-right">
          <button
            onClick={downloadPDF}
            className="bg-[#4154f1] text-white text-xl px-4 py-2 rounded-lg mt-4"
          >
            Generate PDF
          </button>
        </div> */}
        {/* Template Modal Section */}
        {isModalOpen && (
          <TemplateModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSelect={handleTemplateSelect}
          />
        )}
      </div>
    </div>
  );
};

export default GstInvoice;