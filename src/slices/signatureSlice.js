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
    enabled: JSON.parse(localStorage.getItem("Signature-Invoice")) || false,
  },
  reducers: {
    setSignature: (state, action) => {
      state.signature = action.payload;
      localStorage.setItem('Signature', state.signature);
    },
    removeSignature: () => {
        localStorage.removeItem('Signature');
    },
    toggle:(state)=>{
        state.enabled = !state.enabled;
        localStorage.setItem("Signature-Invoice", JSON.stringify(state.enabled));
    }
  },
});

export const { setSignature, removeSignature, toggle} = signatureSlice.actions;
export default signatureSlice.reducer;