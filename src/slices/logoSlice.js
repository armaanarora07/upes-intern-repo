import { createSlice } from '@reduxjs/toolkit';

const loadLogoFromLocalStorage = () => {
  try {
    const logo = localStorage.getItem('logo');
    return logo; 
  } catch (error) {
    console.error("Failed to get data local storage:", error);
    return ''; 
  }
};


const logoSlice = createSlice({
  name: 'logo',
  initialState:{
    logo:loadLogoFromLocalStorage(),
  },
  reducers: {
    setLogo: (state, action) => {
      state.logo = action.payload;
      localStorage.setItem('logo', state.logo);
    },
    removeLogo: () => {
        localStorage.removeItem('logo');
    },
  },
});

export const { setLogo, removeLogo} = logoSlice.actions;
export default logoSlice.reducer;