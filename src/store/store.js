// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import  authReducer from '../slices/authSlice.js';
import  ewayReducer from '../slices/ewaySlice.js';
import businessReducer from '../slices/businessSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    eway: ewayReducer,
    business:businessReducer
  },
});

export default store;
