import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// Fetch businesses from API
export const fetchBanks = createAsyncThunk(
  "bank/fetch",
  async (_, { rejectWithValue }) => {
    
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/bank`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const data = response.data.data || [];
      const bankdata = data.map((bank) => ({ accountNumber:bank.ac_no, ifscCode:bank.ifsc,upiId:bank.upi, bankName:bank.bank_name }))
      return bankdata;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


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
    loading: false,
    error: null,
  },
  reducers: {
    SelectedBank: (state, action) => {
      state.selectedGBank = action.payload;
      localStorage.setItem('selectedBankDetails', JSON.stringify(state.selectedGBank));
    },
    clearSelectedBank: (state) => {
      state.selectedGBank = [];
      localStorage.removeItem('selectedBankDetails');
    },
    deleteBankDetails:(state) =>{
      localStorage.removeItem('bankDetails');
    },
    setEnabled:(state)=>{
      state.enabled = !state.enabled;
      localStorage.setItem("Bank-Invoice", JSON.stringify(state.enabled));
    }
  },
  extraReducers: (builder) => {
      builder
        .addCase(fetchBanks.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchBanks.fulfilled, (state, action) => {
          state.loading = false;
          state.bankDetails = action.payload;
          localStorage.setItem('bankDetails', JSON.stringify(action.payload)); // Store in localStorage
        })
        .addCase(fetchBanks.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
      },
});

export const { SelectedBank, clearSelectedBank, deleteBankDetails, setEnabled } = bankSlice.actions;
export default bankSlice.reducer;