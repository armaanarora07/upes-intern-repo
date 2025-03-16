import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch businesses from API
export const fetchTandC = createAsyncThunk(
  "tnc/fetch",
  async (_, { rejectWithValue }) => {
    
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/tnc`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      console.log()
      return response.data.data[0].tnc || "";
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


const loadGSTTandCDetailsFromLocalStorage = () => {
  try {
    const termsandConditions = localStorage.getItem('GSTTermsandConditions') || '';
    return termsandConditions; 
  } catch (error) {
    console.error("Failed to get data local storage:", error);
    return '';
  }
};

const loadURDTandCDetailsFromLocalStorage = () => {
  try {
    const termsandConditions = localStorage.getItem('URDTermsandConditions') || '';
    return termsandConditions; 
  } catch (error) {
    console.error("Failed to get data local storage:", error);
    return ''; 
  }
};

const tandcSlice = createSlice({
  name: 'tandc',
  initialState:{
    GSTtandcDetails:loadGSTTandCDetailsFromLocalStorage(),
    URDtandcDetails:loadURDTandCDetailsFromLocalStorage(),
  },
  reducers: {
    setGSTtandcDetails: (state, action) => {
      state.GSTtandcDetails = action.payload;
      localStorage.setItem('GSTTermsandConditions', state.GSTtandcDetails);
    },
    setURDtandcDetails: (state, action) => {
      state.URDtandcDetails = action.payload;
      localStorage.setItem('URDTermsandConditions', state.URDtandcDetails);
    },
  },
  extraReducers: (builder) => {
        builder
          .addCase(fetchTandC.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchTandC.fulfilled, (state, action) => {
            state.loading = false;
            state.GSTtandcDetails = action.payload;
            state.URDtandcDetails = action.payload;
            localStorage.setItem('GSTTermsandConditions', state.GSTtandcDetails);
            localStorage.setItem('URDTermsandConditions', state.URDtandcDetails);
          })
          .addCase(fetchTandC.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
  },
});

export const { setGSTtandcDetails, setURDtandcDetails } = tandcSlice.actions;
export default tandcSlice.reducer;