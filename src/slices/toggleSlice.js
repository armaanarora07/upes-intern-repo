import { createSlice } from "@reduxjs/toolkit";

// Load state from localStorage or default to false
const initialState = {
  enabled: JSON.parse(localStorage.getItem("toggleState")) || false,
  selection: localStorage.getItem("selection") || 'Signature',
};

const toggleSlice = createSlice({
  name: "toggle",
  initialState,
  reducers: {
    toggleSwitch: (state) => {
      state.enabled = !state.enabled;
      localStorage.setItem("toggleState", JSON.stringify(state.enabled)); // Persist state
      if(state.enabled){
        state.selection = 'Stamp';
      }else{
        state.selection = 'Signature';
      }
      localStorage.setItem("selection",state.selection);
    },
  },
});

export const { toggleSwitch } = toggleSlice.actions;
export default toggleSlice.reducer;
