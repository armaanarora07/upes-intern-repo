import { createSlice } from '@reduxjs/toolkit';

const loadGSTTandCDetailsFromLocalStorage = () => {
  try {
    const termsandConditions = localStorage.getItem('GSTTermsandConditions') || '';
    return termsandConditions; 
  } catch (error) {
    console.error("Failed to get data local storage:", error);
    return '';
  }
};

const loadURDTandCDetailsFromLocalStorage = () => {
  try {
    const termsandConditions = localStorage.getItem('URDTermsandConditions') || '';
    return termsandConditions; 
  } catch (error) {
    console.error("Failed to get data local storage:", error);
    return ''; 
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