import { createSlice } from '@reduxjs/toolkit';

const loadStampFromLocalStorage = () => {
  try {
    const stamp = localStorage.getItem('Stamp');
    return stamp; 
  } catch (error) {
    console.error("Failed to get data local storage:", error);
    return ''; 
  }
};


const stampSlice = createSlice({
  name: 'stamp',
  initialState:{
    stamp:loadStampFromLocalStorage(),
    enabled: JSON.parse(localStorage.getItem("Stamp-Invoice")) || false,
  },
  reducers: {
    setStamp: (state, action) => {
      state.stamp = action.payload;
      localStorage.setItem('Stamp', state.stamp);
    },
    removeStamp: () => {
        localStorage.removeItem('Stamp');
    },
    toggle:(state)=>{
        state.enabled = !state.enabled;
        localStorage.setItem("Stamp-Invoice", JSON.stringify(state.enabled));
    }
  },
});

export const { setStamp, removeStamp, toggle} = stampSlice.actions;
export default stampSlice.reducer;