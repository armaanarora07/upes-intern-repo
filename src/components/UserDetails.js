import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setTradeName,
  setPhoneNo,
  setInvoiceNo,
  updatePrimaryAddress,
  updateShippingAddress,
  toggleShippingSameAsPrimary,
  selectUserDetails,
  selectIsShippingSameAsPrimary,
  invoiceDate,
  setInvoiceDate
} from '../slices/userdetailsSlice';

const UserDetails = ({Title}) => {
  const dispatch = useDispatch();
  const userDetails = useSelector(selectUserDetails);
  const isShippingSameAsPrimary = useSelector(selectIsShippingSameAsPrimary);
  const date = useSelector(invoiceDate);

  const handleSameAsShipping = () => {
    dispatch(toggleShippingSameAsPrimary());
  };

  const handlePrimaryAddressChange = (field, value) => {
    dispatch(updatePrimaryAddress({ [field]: value }));
  };

  const handleShippingAddressChange = (field, value) => {
    dispatch(updateShippingAddress({ [field]: value }));
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const isoDate = selectedDate.toISOString();
    dispatch(setInvoiceDate(isoDate));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl mt-5">
      <h2 className="text-2xl font-bold text-gray-800">{Title}</h2>
      <div className="flex space-x-2">
        <div className="w-2/5 p-2 relative">
          <div className="space-y-4 relative mt-4">
            <div className="relative mb-4">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                Name
              </span>
              <input
                type="text"
                value={userDetails.tradeName}
                onChange={(e) => dispatch(setTradeName(e.target.value))}
                className="w-full border border-[#4154f1] rounded-lg p-2"
              />
            </div>

            <div className="relative">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                Phone No
              </span>
              <input
                type="text"
                value={userDetails.phoneNo}
                onChange={(e) => dispatch(setPhoneNo(e.target.value))}
                className="w-full border border-[#4154f1] rounded-lg p-2"
              />
            </div>
          </div>
        </div>
        <div className="w-1/5 p-2 relative">
          <div className="space-y-4 relative">
            <div className="relative mt-4">
                  <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                    Invoice Date
                  </span>
                  <input
                    type="date"
                    value={date}
                    onChange={handleDateChange}
                    className="w-full border border-[#4154f1] rounded-lg p-2"
                  />
            </div>
            <div className="relative">
                  <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                    Invoie No
                  </span>
                  <input
                    type="text"
                    value={userDetails.invoiceNo}
                    onChange={(e) => dispatch(setInvoiceNo(e.target.value))}
                    className="w-full border border-[#4154f1] rounded-lg p-2"
                  />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <div className="w-2/5 p-2 relative">
          <span>Address Type</span>
          <div className="space-y-4 relative mt-4">
            <div className="relative mb-4">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                Address
              </span>
              <input
                type="text"
                value={userDetails.primaryAddress.address1}
                onChange={(e) => handlePrimaryAddressChange('address1', e.target.value)}
                className="w-full border border-[#4154f1] rounded-lg p-2"
              />
            </div>

            <div className="relative">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                City PinCode
              </span>
              <input
                type="text"
                value={userDetails.primaryAddress.pincode}
                onChange={(e) => handlePrimaryAddressChange('pincode', e.target.value)}
                className="w-full border border-[#4154f1] rounded-lg p-2"
              />
            </div>

            <div className="relative">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                State
              </span>
              <input
                type="text"
                value={userDetails.primaryAddress.state}
                onChange={(e) => handlePrimaryAddressChange('state', e.target.value)}
                className="w-full border border-blue-500 rounded-lg p-2"
              />
            </div>
          </div>
        </div>

        <div className="w-2/5 p-2 relative">
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={isShippingSameAsPrimary}
              className="mr-2 text-black accent-blue-500"
              onChange={handleSameAsShipping}
            />
            <span>Same as shipping address</span>
          </label>
          
          <div className="space-y-4 relative">
            <div className="relative">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                Address
              </span>
              <input
                type="text"
                value={userDetails.shippingAddress.address1}
                onChange={(e) => handleShippingAddressChange('address1', e.target.value)}
                className="w-full border border-[#4154f1] rounded-lg p-2"
              />
            </div>

            <div className="relative">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                City Pincode
              </span>
              <input
                type="text"
                value={userDetails.shippingAddress.pincode}
                onChange={(e) => handleShippingAddressChange('pincode', e.target.value)}
                className="w-full border border-[#4154f1] rounded-lg p-2"
              />
            </div>

            <div className="relative">
              <span className="absolute -top-3 left-2 text-sm bg-white px-1 text-black">
                State
              </span>
              <input
                type="text"
                value={userDetails.shippingAddress.state}
                onChange={(e) => handleShippingAddressChange('state', e.target.value)}
                className="w-full border border-[#4154f1] rounded-lg p-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;