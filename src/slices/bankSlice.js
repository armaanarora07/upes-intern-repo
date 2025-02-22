import { createSlice } from '@reduxjs/toolkit';

const loadBankDetailsFromLocalStorage = () => {
  try {
    const storedBanks = JSON.parse(localStorage.getItem('bankDetails'));
    return storedBanks || []; // Return an empty array if storedBanks is null
  } catch (error) {
    console.error("Failed to parse bank details from local storage:", error);
    return []; // Return an empty array on error
  }
};

const bankSlice = createSlice({
  name: 'banks',
  initialState: {
    bankDetails: loadBankDetailsFromLocalStorage(),
    selectedBankIndex: null,
  },
  reducers: {
    addBankDetails: (state, action) => {
      const newBank = action.payload;
      state.bankDetails.push(newBank);
      localStorage.setItem('bankDetails', JSON.stringify(state.bankDetails));
    },
    SelectedBank: (state, action) => {
      state.selectedBankIndex = action.payload;
    },
    clearSelectedBank: (state) => {
      state.selectedBankIndex = null;
    },
    editBankDetails: (state, action) => {
      const { index, updatedBank } = action.payload;
      state.bankDetails[index] = updatedBank;
      localStorage.setItem('bankDetails', JSON.stringify(state.bankDetails));
    },
    deleteBankDetails:(state) =>{
      localStorage.setItem('bankDetails', []);
    }
  },
});

export const { addBankDetails, SelectedBank, clearSelectedBank, editBankDetails, deleteBankDetails } = bankSlice.actions;
export default bankSlice.reducer;