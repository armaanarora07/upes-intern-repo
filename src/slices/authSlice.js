import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authToken: localStorage.getItem("authToken") || null,
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
      localStorage.removeItem("authToken");
    },
  },
});

export const { login, logout, signup } = authSlice.actions;
export default authSlice.reducer;
