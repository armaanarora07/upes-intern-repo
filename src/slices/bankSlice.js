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

const loadSelectedBankDetailsFromLocalStorage = () => {
  try {
    const storedBanks = JSON.parse(localStorage.getItem('selectedBankDetails'));
    return storedBanks; // Return an empty array if storedBanks is null
  } catch (error) {
    console.error("Failed to parse bank details from local storage:", error);
    return []; // Return an empty array on error
  }
};

const bankSlice = createSlice({
  name: 'banks',
  initialState: {
    bankDetails: loadBankDetailsFromLocalStorage(),
    selectedGBank: loadSelectedBankDetailsFromLocalStorage(),
    enabled: JSON.parse(localStorage.getItem("Bank-Invoice")) || false, 
  },
  reducers: {
    addBankDetails: (state, action) => {
      const newBank = action.payload;
      state.bankDetails.push(newBank);
      localStorage.setItem('bankDetails', JSON.stringify(state.bankDetails));
    },
    SelectedBank: (state, action) => {
      state.selectedGBank = action.payload;
      localStorage.setItem('selectedBankDetails', JSON.stringify(state.selectedGBank));
    },
    clearSelectedBank: (state) => {
      state.selectedGBank = [];
      localStorage.removeItem('selectedBankDetails');
    },
    editBankDetails: (state, action) => {
      const { index, updatedBank } = action.payload;
      state.bankDetails[index] = updatedBank;
      localStorage.setItem('bankDetails', JSON.stringify(state.bankDetails));
    },
    deleteBankDetails:(state) =>{
      localStorage.removeItem('bankDetails');
    },
    setEnabled:(state)=>{
      state.enabled = !state.enabled;
      localStorage.setItem("Bank-Invoice", JSON.stringify(state.enabled));
    }
  },
});

export const { addBankDetails, SelectedBank, clearSelectedBank, editBankDetails, deleteBankDetails, setEnabled } = bankSlice.actions;
export default bankSlice.reducer;