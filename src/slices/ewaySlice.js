import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  eway_enabled: JSON.parse(localStorage.getItem("eway")) || false,
  enable: JSON.parse(localStorage.getItem("eway-enable")) || false,
};

const ewaySlice = createSlice({
  name: "eway",
  initialState,
  reducers: {
    setEway: (state, action) => {
      state.eway_enabled = action.payload;
      localStorage.setItem("eway", JSON.stringify(action.payload));
    },
    toggle: (state) =>{
       state.enable = !state.enable;
       localStorage.setItem("eway-enable",JSON.stringify(state.enable));
    }
  },
});

export const { setEway, toggle } = ewaySlice.actions;
export default ewaySlice.reducer;
