import { createSlice } from "@reduxjs/toolkit";

const getDateFromStorage = () => {
  return localStorage.getItem("Validity") || null;
};

const initialState = {
  date: getDateFromStorage(), // Load from localStorage
};

const validitySlice = createSlice({
  name: "validity",
  initialState,
  reducers: {
    setDate: (state, action) => {
      state.date = action.payload.split("T")[0];
      localStorage.setItem("Validity", state.date);
    },
  },
});

export const { setDate } = validitySlice.actions;
export default validitySlice.reducer;
