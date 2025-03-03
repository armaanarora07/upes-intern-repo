import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch businesses from API
export const fetchBusinesses = createAsyncThunk(
  "business/fetch",
  async (_, { rejectWithValue }) => {
    
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/myBusiness`, {
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

const initialState = {
  businesses: JSON.parse(localStorage.getItem("businesses")) || [],
  selectedBusiness:JSON.parse(localStorage.getItem("selectedBusiness")) || '',
  loading: false,
  error: null,
};

const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    setBusiness:(state,action)=>{
       state.selectedBusiness = action.payload;
       localStorage.setItem("selectedBusiness",JSON.stringify(state.selectedBusiness));
    }
  },
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
  },
});

// Ensure we fetch data if it's not in localStorage
export const checkAndFetchBusinesses = () => async (dispatch) => {
  const storedBusinesses = JSON.parse(localStorage.getItem("businesses"));
  if (!storedBusinesses || storedBusinesses.length === 0) {
    dispatch(fetchBusinesses());
  }
};
export const {setBusiness} = businessSlice.actions;
export default businessSlice.reducer;
