import { createSlice } from '@reduxjs/toolkit';

const loadQRFromLocalStorage = () => {
  try {
    const qr = localStorage.getItem('qr');
    return qr; 
  } catch (error) {
    console.error("Failed to get data local storage:", error);
    return ''; 
  }
};


const qrSlice = createSlice({
  name: 'qr',
  initialState:{
    qr:loadQRFromLocalStorage(),
  },
  reducers: {
    setQr: (state, action) => {
      state.qr = action.payload;
      localStorage.setItem('qr', state.qr);
    },
    removeQr: () => {
        localStorage.removeItem('qr');
    },
  },
});

export const { setQr, removeQr} = qrSlice.actions;
export default qrSlice.reducer;