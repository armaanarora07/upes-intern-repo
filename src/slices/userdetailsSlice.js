import { createSlice } from '@reduxjs/toolkit';

// Load initial state from localStorage if available
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('userDetails');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const initialState = loadState() || {
  tradeName: '',
  legalName: '',
  phoneNo: '',
  invoiceDate: new Date().toISOString().split('T')[0],
  invoiceNo:'',
  primaryAddress: {
    address1: '',
    address2: '',
    pincode: '',
    state: '',
    city: '',
    country: ''
  },
  shippingAddress: {
    address1: '',
    address2: '',
    pincode: '',
    state: '',
    city: '',
    country: ''
  },
  isShippingSameAsPrimary: false
};

// Save state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('userDetails', serializedState);
  } catch (err) {
    // Handle write errors here
    console.error('Error saving state to localStorage:', err);
  }
};

const userDetailsSlice = createSlice({
  name: 'userDetails',
  initialState,
  reducers: {
    setTradeName: (state, action) => {
      state.tradeName = action.payload;
      saveState(state);
    },
    setLegalName: (state, action) => {
      state.legalName = action.payload;
      saveState(state);
    },
    setPhoneNo: (state, action) => {
      state.phoneNo = action.payload;
      saveState(state);
    },
    setInvoiceNo: (state, action) => {
      state.invoiceNo = action.payload;
      saveState(state);
    },
    setInvoiceDate: (state, action) => {
      state.invoiceDate = action.payload;
      saveState(state);
    },
    updatePrimaryAddress: (state, action) => {
      state.primaryAddress = {
        ...state.primaryAddress,
        ...action.payload
      };
      saveState(state);
    },
    updateShippingAddress: (state, action) => {
      state.shippingAddress = {
        ...state.shippingAddress,
        ...action.payload
      };
      saveState(state);
    },
    toggleShippingSameAsPrimary: (state) => {
      state.isShippingSameAsPrimary = !state.isShippingSameAsPrimary;
      if (state.isShippingSameAsPrimary) {
        state.shippingAddress = {
          ...state.primaryAddress
        };
      } else {
        state.shippingAddress.address1 = '';
        state.shippingAddress.address2 = '';
        state.shippingAddress.pincode = '';
        state.shippingAddress.city = '';
        state.shippingAddress.state = '';
        state.shippingAddress.country = '';
      }
      saveState(state);
    },
    clearUserDetails: (state) => {
      // Clear localStorage
      localStorage.removeItem('userDetails');
      // Reset state to initial values
      return {
        tradeName: '',
        legalName: '',
        phoneNo: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        invoiceNo:'',
        primaryAddress: {
          address1: '',
          address2: '',
          pincode: '',
          state: '',
          city: '',
          country: ''
        },
        shippingAddress: {
          address1: '',
          address2: '',
          pincode: '',
          state: '',
          city: '',
          country: ''
        },
        isShippingSameAsPrimary: false
      };
    }
  }
});

export const {
  setTradeName,
  setLegalName,
  setPhoneNo,
  setInvoiceNo,
  setInvoiceDate,
  updatePrimaryAddress,
  updateShippingAddress,
  toggleShippingSameAsPrimary,
  clearUserDetails
} = userDetailsSlice.actions;

// Selectors
export const selectUserDetails = (state) => state.userDetails;
export const selectPrimaryAddress = (state) => state.userDetails.primaryAddress;
export const selectShippingAddress = (state) => state.userDetails.shippingAddress;
export const selectIsShippingSameAsPrimary = (state) => state.userDetails.isShippingSameAsPrimary;
export const invoiceDate = (state) => state.userDetails.invoiceDate;

export default userDetailsSlice.reducer;