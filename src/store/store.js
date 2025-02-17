// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import  authReducer from '../slices/authSlice.js';
import  ewayReducer from '../slices/ewaySlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    eway: ewayReducer
  },
});

export default store;
