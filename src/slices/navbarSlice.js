import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: '',
};

const navbarSlice = createSlice({
  name: "navbar",
  initialState,
  reducers: {
    setTitle: (state, action) => {
      state.title = action.payload;
    },
  },
});

export const { setTitle } = navbarSlice.actions;
export default navbarSlice.reducer;
