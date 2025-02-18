import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://fyntl.sangrahinnovations.com/user";

// Fetch businesses from API
export const fetchBusinesses = createAsyncThunk(
  "business/fetch",
  async (_, { rejectWithValue }) => {
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await axios.get(`${BASE_URL}/myBusiness`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const data = response.data.data || [];
      localStorage.setItem("businesses", JSON.stringify(data)); // Store in localStorage
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update shipping address
export const updateAddress = createAsyncThunk(
  "business/updateAddress",
  async (updatedAddress, { rejectWithValue }) => {
    const authToken = localStorage.getItem("authToken");

    try {
      await axios.put(`${BASE_URL}/address`, updatedAddress, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      return updatedAddress;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Add skipped bill
export const addSkippedBill = createAsyncThunk(
  "business/addSkippedBill",
  async (billData, { rejectWithValue }) => {
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await axios.post(`${BASE_URL}/skippedbill`, billData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update serial number
export const updateSerialNumber = createAsyncThunk(
  "business/updateSnNo",
  async (snData, { rejectWithValue }) => {
    const authToken = localStorage.getItem("authToken");

    try {
      await axios.put(`${BASE_URL}/mySnNo`, snData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      return snData;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Add HSN code
export const addHSN = createAsyncThunk(
  "business/addHSN",
  async (hsnData, { rejectWithValue }) => {
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await axios.post(`${BASE_URL}/hsn`, hsnData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete HSN code
export const deleteHSN = createAsyncThunk(
  "business/deleteHSN",
  async (hsnId, { rejectWithValue }) => {
    const authToken = localStorage.getItem("authToken");

    try {
      await axios.delete(`${BASE_URL}/hsn`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: { id: hsnId }, // Sending ID in request body
      });

      return hsnId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  businesses: JSON.parse(localStorage.getItem("businesses")) || [],
  loading: false,
  error: null,
};

const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinesses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinesses.fulfilled, (state, action) => {
        state.loading = false;
        state.businesses = action.payload;
      })
      .addCase(fetchBusinesses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.businesses = state.businesses.map((business) =>
          business.id === action.payload.id ? { ...business, address: action.payload } : business
        );
      })
      .addCase(addSkippedBill.fulfilled, (state, action) => {
        state.businesses.push(action.payload);
      })
      .addCase(updateSerialNumber.fulfilled, (state, action) => {
        state.businesses = state.businesses.map((business) =>
          business.id === action.payload.id ? { ...business, snNo: action.payload.snNo } : business
        );
      })
      .addCase(addHSN.fulfilled, (state, action) => {
        state.businesses.push(action.payload);
      })
      .addCase(deleteHSN.fulfilled, (state, action) => {
        state.businesses = state.businesses.filter((business) => business.hsn !== action.payload);
      });
  },
});

// Ensure we fetch data if it's not in localStorage
export const checkAndFetchBusinesses = () => async (dispatch) => {
  const storedBusinesses = JSON.parse(localStorage.getItem("businesses"));
  if (!storedBusinesses || storedBusinesses.length === 0) {
    dispatch(fetchBusinesses());
  }
};

export default businessSlice.reducer;
