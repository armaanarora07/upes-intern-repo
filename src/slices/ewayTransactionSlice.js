import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    _id: "",
    first_party: "",
    sn_no: "",
    hsns: [],
    products: [],
    rate: [],
    quantity: [],
    second_party: "",
    gst_rate: [],
    shipping_address: {},
    eway_status: "",
    paymentType: "",
    paymentStatus: {},
    created_at: "",
    downloadlink: ""
};

const ewayTransactionSlice = createSlice({
    name: "ewayTransaction",
    initialState,
    reducers: {
        setTransactionData: (state, action) => {
            return { ...state, ...action.payload };
        },
        resetTransactionData: () => initialState
    }
});

export const { setTransactionData, resetTransactionData } = ewayTransactionSlice.actions;
export default ewayTransactionSlice.reducer;
