import { createSlice } from '@reduxjs/toolkit';

const loadSignatureFromLocalStorage = () => {
  try {
    const signature = localStorage.getItem('Signature');
    return signature; 
  } catch (error) {
    console.error("Failed to get data local storage:", error);
    return ''; 
  }
};


const signatureSlice = createSlice({
  name: 'signature',
  initialState:{
    signature:loadSignatureFromLocalStorage(),
  },
  reducers: {
    setSignature: (state, action) => {
      state.signature = action.payload;
      localStorage.setItem('Signature', state.signature);
    },
    removeSignature: () => {
        localStorage.removeItem('Signature');
    },
  },
});

export const { setSignature, removeSignature} = signatureSlice.actions;
export default signatureSlice.reducer;