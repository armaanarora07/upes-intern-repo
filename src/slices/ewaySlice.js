import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  eway_enabled: JSON.parse(localStorage.getItem("eway")) || false,
};

const ewaySlice = createSlice({
  name: "eway",
  initialState,
  reducers: {
    setEway: (state, action) => {
      state.eway_enabled = action.payload;
      localStorage.setItem("eway", JSON.stringify(action.payload));
    }
  },
});

export const { setEway } = ewaySlice.actions;
export default ewaySlice.reducer;
