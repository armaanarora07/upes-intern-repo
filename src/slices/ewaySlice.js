import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  eway_enabled: localStorage.getItem("eway") || null,
};

const ewaySlice = createSlice({
  name: "eway",
  initialState,
  reducers: {
    setEway: (state, action) => {
      state.eway_enabled = action.payload;
      localStorage.setItem("eway", action.payload);
    },
  },
});

export const { setEway } = ewaySlice.actions;
export default ewaySlice.reducer;
