// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import  authReducer from '../slices/authSlice.js';
import  ewayReducer from '../slices/ewaySlice.js';
import businessReducer from '../slices/businessSlice.js';
import banksReducer from '../slices/bankSlice.js';
import tandcReducer from  '../slices/tandcSlice.js';
import signatureReducer, { toggle } from '../slices/signatureSlice.js';
import stampReducer from '../slices/stampSlice.js';
import productsReducer from '../slices/productSlice.js';
import gstReducer from '../slices/gstSlice.js';
import userDetailsReducer from '../slices/userdetailsSlice.js';
import navbarReducer from '../slices/navbarSlice.js';
import logoReducer from '../slices/logoSlice.js';
import toggleReducer from '../slices/toggleSlice.js';
import qrReducer from '../slices/qrSlice.js';
import themeReducer from '../slices/themeSlice.js';
import validityReducer from '../slices/validitySlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    eway: ewayReducer,
    business:businessReducer,
    banks:banksReducer,
    tandc:tandcReducer,
    signature:signatureReducer,
    stamp:stampReducer,
    products:productsReducer,
    gst:gstReducer,
    userDetails:userDetailsReducer,
    navbar:navbarReducer,
    logo:logoReducer,
    toggle:toggleReducer,
    qr:qrReducer,
    theme: themeReducer,
    validity:validityReducer,
  },
});

export default store;
