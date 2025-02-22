import { createSlice } from '@reduxjs/toolkit';

const loadGSTTandCDetailsFromLocalStorage = () => {
  try {
    const termsandConditions = localStorage.getItem('GSTTermsandConditions');
    return termsandConditions; // Return an empty array if storedBanks is null
  } catch (error) {
    console.error("Failed to parse bank details from local storage:", error);
    return ''; // Return an empty array on error
  }
};

const loadURDTandCDetailsFromLocalStorage = () => {
  try {
    const termsandConditions = localStorage.getItem('URDTermsandConditions');
    return termsandConditions; // Return an empty array if storedBanks is null
  } catch (error) {
    console.error("Failed to parse bank details from local storage:", error);
    return ''; // Return an empty array on error
  }
};

const tandcSlice = createSlice({
  name: 'tandc',
  initialState:{
    GSTtandcDetails:loadGSTTandCDetailsFromLocalStorage(),
    URDtandcDetails:loadURDTandCDetailsFromLocalStorage(),
  },
  reducers: {
    setGSTtandcDetails: (state, action) => {
      state.GSTtandcDetails = action.payload;
      localStorage.setItem('GSTTermsandConditions', state.GSTtandcDetails);
    },
    setURDtandcDetails: (state, action) => {
      state.URDtandcDetails = action.payload;
      localStorage.setItem('URDTermsandConditions', state.URDtandcDetails);
    },
  },
});

export const { setGSTtandcDetails, setURDtandcDetails } = tandcSlice.actions;
export default tandcSlice.reducer;