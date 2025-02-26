import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authToken: localStorage.getItem("authToken") || null,
  otp: localStorage.getItem("authToken") ? true : false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.authToken = action.payload;
      localStorage.setItem("authToken", action.payload);
    },
    signup: (state, action) => {
        state.authToken = action.payload;
        localStorage.setItem("authToken", action.payload);
      },
    logout: (state) => {
      state.authToken = null;
      state.otp = false;
      localStorage.removeItem("authToken");
      localStorage.removeItem('bankDetails');
      localStorage.removeItem('selectedBankDetails');
      localStorage.removeItem("businesses");
      localStorage.removeItem("eway");
      localStorage.removeItem('Signature');
      localStorage.removeItem('Stamp');
      localStorage.removeItem('GSTTermsandConditions');
      localStorage.removeItem('URDTermsandConditions');
    },
    verifyotp: (state) => {
      state.otp = true;
    },
  },
});

export const { login, logout, signup, verifyotp } = authSlice.actions;
export default authSlice.reducer;
