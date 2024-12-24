import React, { useState } from "react";
import { FaBusinessTime } from "react-icons/fa";
import Additem from "../assets/Additem.png";
import Share from "../assets/Share.png";
import Download from "../assets/Download.png";
import Select from "../assets/Select.png";
import Next from "../assets/Next.png";
import TemplateModal from "./TemplateModal";
const createRow = (id) => ({
  id: id,
  product_info: "",       // Add product_info
  hsn_code: "",           // Add hsn_code
  quantity: "",
  unit: "KG",
  price: "",
  taxPercent: "",
  taxAmount: "Tax Amount",
  amount: "Amount",
  cgst: "",               // Add cgst
  sgst: "",               // Add sgst
  rate: "",               // Add rate if it's relevant
});


const GenerateNewBill = () => {
  const [rows, setRows] = useState([createRow(1)]);
  const [showModal, setShowModal] = useState(false);
  const [isRightEnabled, setIsRightEnabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [tradeName, setTradeName] = useState("");
  const [paddress, setpAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [saddress, setsAddress] = useState("");
  const [spincode, setSPincode] = useState("");
  const [sstate, setSState] = useState("");

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
    (sum, row) => sum + Number(row.quantity),
    0
  );
  const totalTax = rows.reduce(
    (sum, row) => sum + Number(((Number(row.quantity) * Number(row.price) * Number(row.taxPercent)) / 100).toFixed(2)),
    0
  );
  const totalAmount = rows.reduce((sum, row) => sum + Number(row.amount), 0);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setIsModalOpen(false);
  };

  const downloadPDF = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("Authorization token is missing. Please log in again.");
      return;
    }
  
    // Check your rows structure
    console.log("Rows data:", rows); // Debugging line
  
    const body = {
      party: {
        gstin: "09CYLPR6774F1ZN",
        legal_name: "",
        trade_name: tradeName,
        principal_address: {
          address1: paddress,
          address2: "",
          pincode: pincode,
          city: "",
          state: state,
          country: "IN",
        },
        shipping_address: {
          address1: saddress,
          address2: "",
          pincode: spincode,
          city: "",
          state: sstate,
          country: "IN",
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

  return (
    <div className="p-2 pl-2 sm:pl-4">
      <div className="bg-blue-200 text-blue-600 text-xl sm:text-3xl font-semibold rounded-lg p-4 flex items-center">
        <FaBusinessTime className="text-gray-500 mr-4" />
        Generate New Bill
      </div>
      <div className="text-xl sm:text-2xl mt-2 font-semibold">
        Buyer's Details
      </div>
      <div className="flex space-x-12">
        <div className="w-2/5 p-2 relative">
          <div className="space-y-4 relative mt-4">
            {/* Input 1 */}
            <div className="relative mb-4">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                Name
              </span>
              <input
                type="text"
                value={tradeName} // Controlled input
                onChange={(e) => setTradeName(e.target.value)} // Update state on input change
                className="w-full border border-blue-500 rounded-lg p-2"
              />
            </div>

            {/* Input 2 */}
            <div className="relative">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                Phone No
              </span>
              <input
                type="text"
                className="w-full border border-blue-500 rounded-lg p-2"
              />
            </div>
          </div>
        </div>
        <div className="w-1/5 p-2 relative">
          <div className="space-y-4">
            <div className="flex items-end space-x-4">
              <label htmlFor="billNo" className="font-semibold">
                Bill No:
              </label>
              <input
                type="text"
                id="billNo"
                className="border-b-2 border-gray-300 outline-none focus:border-blue-500 w-full"
                placeholder="Enter Bill No"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label htmlFor="billDate" className="font-semibold">
                Bill Date:
              </label>
              <input
                type="date"
                id="billDate"
                className="border-b-2 border-gray-300 outline-none focus:border-blue-500 w-full"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex space-x-2">
        {/* Left Section */}
        <div className="w-2/5 p-2 relative">
          <span> Address Type </span>
          {/* Input Fields for Left Section */}
          <div className="space-y-4 relative mt-4">
            {/* Input 1 */}
            <div className="relative mb-4">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                Address
              </span>
              <input
                type="text"
                value={paddress} // Controlled input
                onChange={(e) => setpAddress(e.target.value)} // Update state on input change
                className="w-full border border-blue-500 rounded-lg p-2"
              />
            </div>

            {/* Input 2 */}
            <div className="relative">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                City PinCode
              </span>
              <input
                type="text"
                value={pincode} // Controlled input
                onChange={(e) => setPincode(e.target.value)} // Update state on input change
                className="w-full border border-blue-500 rounded-lg p-2"
              />
            </div>
            <div className="relative">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                State
              </span>
              <input
                type="text"
                value={state} // Controlled input
                onChange={(e) => setState(e.target.value)} // Update state on input change
                className="w-full border border-blue-500 rounded-lg p-2"
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-2/5 p-2 relative">
          <label className="flex items-center mb-4">
            <input
              type="radio"
              name="section"
              className="mr-2 text-black accent-blue-500"
              onChange={() => {
                setIsRightEnabled(true);
              }}
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
                value={saddress} // Controlled input
                onChange={(e) => setsAddress(e.target.value)} // Update state on input change
                className="w-full border border-blue-500 rounded-lg p-2"
              />
            </div>
            {/* Input 2 */}
            <div className="relative">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                City Pincode
              </span>
              <input
                type="text"
                value={spincode} // Controlled input
                onChange={(e) => setSPincode(e.target.value)} // Update state on input change
                className="w-full border border-blue-500 rounded-lg p-2"
              />
            </div>
            {/* Input 3 */}
            <div className="relative">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                State
              </span>
              <input
                type="text"
                value={sstate} // Controlled input
                onChange={(e) => setSState(e.target.value)} // Update state on input change
                className="w-full border border-blue-500 rounded-lg p-2"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="p-5 text-[#3D3F4B] ">
        <h2 className="text-[1.6rem] font-normal mb-4">Items Details -</h2>
        {/* Edit/Add Items Button */}
        <button
          onClick={addRow}
          className="flex items-center text-lg gap-2 px-3 py-[0.35rem] bg-[#eff0f4] border  border-[#BCC3D5] rounded-md shadow-md mb-4 hover:bg-gray-200"
        >
          <img src={Additem} alt="logo"></img>
          Edit/Add Items
        </button>
        {/* Row Items Table */}
        <div className="w-full mb-4">
          <table className="min-w-full bg-[#F9FAFC] shadow-md">
  <thead className="bg-gray-100 text-[#51535e] ">
    <tr>
      <th className="border-b-2 border-r-2 border-[#989BAA] font-medium text-lg w-16" rowSpan="2">S No.</th>
      <th className="border-b-2 border-r-2 border-[#989BAA] font-medium text-lg w-80" rowSpan="2">Item Name</th>
      <th className="border-b-2 border-r-2 border-[#989BAA] font-medium text-lg w-28" rowSpan="2">HSN Code</th>
      <th className="border-b-2 border-r-2 border-[#989BAA] font-medium text-lg w-28" rowSpan="2">Quantity</th>
      <th className="border-b-2 border-r-2 border-[#989BAA] font-medium text-lg w-28" rowSpan="2">Unit</th>
      <th className="border-b-2 border-r-2 border-[#989BAA] font-medium text-lg w-40" rowSpan="2">Price/Unit</th>
      <th className="border-b-2 border-r-2 border-[#989BAA] font-medium text-lg w-36" colSpan="2">Tax (%)</th>
      <th className="border-b-2 border-[#989BAA] font-medium text-lg w-36" rowSpan="2">Amount</th>
    </tr>
    <tr>
      <th className="border-b-2 border-r-2 border-[#989BAA] font-normal text-lg">Percent (%)</th>
      <th className="border-b-2 border-r-2 border-[#989BAA] font-normal text-lg">Amount</th>
    </tr>
  </thead>
  <tbody>
    {rows.map((row, index) => (
      <tr key={index} className="border-t">
        <td className="p-1 border-r-2 border-[#989BAA] text-center">{index + 1}</td>
        <td className="p-1 border-r-2 border-[#989BAA]">
          <input
            type="text"
            className="border-2 border-[#EFF0F4] p-1 w-full rounded-xl"
            placeholder="Item Name"
            value={row.product_info}
            onChange={(e) => handleInputChange(index, "product_info", e.target.value)}
          />
        </td>
        <td className="p-1 border-r-2 border-[#989BAA]">
          <input
            type="text"
            className="border-2 border-[#EFF0F4] p-1 w-full rounded-xl"
            placeholder="HSN Code"
            value={row.hsn_code}
            onChange={(e) => handleInputChange(index, "hsn_code", e.target.value)}
          />
        </td>
        <td className="p-1 border-r-2 border-[#989BAA]">
          <input
            type="number"
            className="border-2 border-[#EFF0F4] p-1 w-full rounded-xl"
            placeholder="Qty"
            value={row.quantity}
            onChange={(e) => handleInputChange(index, "quantity", Number(e.target.value))}
          />
        </td>
        <td className="p-1 border-r-2 border-[#989BAA]">
          <select
            className="border-2 border-[#EFF0F4] p-1 w-full rounded-xl"
            value={row.unit}
            onChange={(e) => handleInputChange(index, "unit", e.target.value)}
          >
            <option value="KG">KG</option>
            <option value="L">L</option>
            <option value="PCS">PCS</option>
          </select>
        </td>
        <td className="p-1 border-r-2 border-[#989BAA]">
          <input
            type="number"
            className="border-2 border-[#EFF0F4] p-1 w-full rounded-xl"
            placeholder="Price"
            value={row.price}
            onChange={(e) => handleInputChange(index, "price", Number(e.target.value))}
          />
        </td>
        <td className="p-1 border-r-2 border-[#989BAA]">
          <input
            type="number"
            className="border-2 border-[#EFF0F4] p-1 w-full rounded-xl"
            placeholder="Tax %"
            value={row.taxPercent}
            onChange={(e) => handleInputChange(index, "taxPercent", Number(e.target.value))}
          />
        </td>
        <td className="p-1 border-r-2 border-[#989BAA]">
          <input
            type="number"
            className="border-2 border-[#EFF0F4] p-1 w-full rounded-xl"
            placeholder="Tax Amount"
            value={row.taxAmount}
            readOnly
          />
        </td>
        <td className="p-1">
          <input
            type="number"
            className="border p-1 w-full rounded-lg"
            placeholder="Amount"
            value={row.amount}
            readOnly
          />
        </td>
      </tr>  
    ))}
    <tr className="font-semibold bg-[#E7EDFF] text-[#1436FF]">
                <td colSpan="3" className="p-3 text-right border-r-2 border-[#989BAA]">
                  TOTAL
                </td>
                <td className="p-3 border-r-2 border-[#989BAA] text-right">
                  {totalQuantity}
                </td>
                <td className="p-3 border-r-2 border-[#989BAA] text-right"></td>
                <td className="p-3 border-r-2 border-[#989BAA] text-right"></td>
                <td className="p-3 border-r-2 border-[#989BAA] text-right"></td>
                <td className="p-3 border-r-2 border-[#989BAA] text-right">
                  {totalTax.toFixed(2)}
                </td>
                <td className="p-3 text-right">{totalAmount}</td>
              </tr>

  </tbody>
</table>

        </div>
        <div className="flex items-stretch justify-end">
          {/* Next Button to open the modal */}
          <button
            className="flex items-center font-medium text-lg px-4 py-2 bg-[#F9FAFC] rounded-lg mr-6 mt-8 text-[#1436FF]"
            onClick={() => setIsModalOpen(true)}
          >
            <i className="fas fa-arrow-right"></i>
            Select Template
            <img src={Select} alt="logo" className="ml-2 w-[1.2rem]"></img>
          </button>

          {/* Next Button to open the modal */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center font-medium text-lg px-4 py-2 bg-[#F9FAFC] rounded-lg mr-6 mt-8 text-[#1436FF]"
          >
            <i className="fas fa-arrow-right"></i>
            Next
            <img src={Next} alt="logo" className="ml-2 w-5"></img>
          </button>
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
        <div className="text-right">
          <button
            onClick={downloadPDF}
            className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4"
          >
            Generate PDF
          </button>
        </div>
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

export default GenerateNewBill;