// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import  authReducer from '../slices/authSlice.js';
import  ewayReducer from '../slices/ewaySlice.js';
import businessReducer from '../slices/businessSlice.js';
import banksReducer from '../slices/bankSlice.js';
import tandcReducer from  '../slices/tandcSlice.js';
import signatureReducer from '../slices/signatureSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    eway: ewayReducer,
    business:businessReducer,
    banks:banksReducer,
    tandc:tandcReducer,
    signature:signatureReducer,
  },
});

export default store;
