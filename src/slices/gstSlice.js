import { createSlice } from '@reduxjs/toolkit';

// Load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('gstDetails');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading GST details from localStorage:', err);
    return undefined;
  }
};

// Save state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('gstDetails', serializedState);
  } catch (err) {
    console.error('Error saving GST details to localStorage:', err);
  }
};

const initialState = loadState() || {
  gstDetails: null,
  isVerified: false,
  status: false,
  error: null
};

const gstSlice = createSlice({
  name: 'gst',
  initialState,
  reducers: {
    setGSTDetails: (state, action) => {
      state.gstDetails = action.payload;
      state.isVerified = true;
      state.status = true;
      state.error = null;
      saveState(state);
    },
    setGSTError: (state, action) => {
      state.gstDetails = null;
      state.isVerified = false;
      state.status = true;
      state.error = action.payload;
      saveState(state);
    },
    clearGSTDetails: (state) => {
      // Clear localStorage
      localStorage.removeItem('gstDetails');
      // Reset to initial values
      state.gstDetails = null;
      state.isVerified = false;
      state.status = false;
      state.error = null;
    },
    // New reducer to update specific fields
    updateGSTDetails: (state, action) => {
      state.gstDetails = {
        ...state.gstDetails,
        ...action.payload
      };
      saveState(state);
    }
  }
});

// Selectors
export const selectGSTDetails = (state) => state.gst.gstDetails;
export const selectIsVerified = (state) => state.gst.isVerified;
export const selectGSTStatus = (state) => state.gst.status;
export const selectGSTError = (state) => state.gst.error;

export const { 
  setGSTDetails, 
  setGSTError, 
  clearGSTDetails,
  updateGSTDetails 
} = gstSlice.actions;

export default gstSlice.reducer;