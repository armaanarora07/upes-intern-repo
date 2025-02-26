import { createSlice } from '@reduxjs/toolkit';

// Helper function to create a new row
const createRow = (id) => ({
  id: id,
  product_info: "",
  hsn_code: "",
  quantity: "",
  unit: "KG",
  price: "",
  taxPercent: "",
  taxAmount: 0,
  amount: 0,
  cgst: "",
  sgst: "",
  rate: "",
});

// Load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('products');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return undefined;
  }
};

// Save state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('products', serializedState);
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
};

const initialState = loadState() || {
  rows: [createRow(1)]
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addRow: (state) => {
      state.rows.push(createRow(state.rows.length + 1));
      saveState(state);
    },
    removeRow: (state, action) => {
      state.rows = state.rows.filter((_, index) => index !== action.payload);
      // Update IDs after removal
      state.rows.forEach((row, index) => {
        row.id = index + 1;
      });
      saveState(state);
    },
    updateRow: (state, action) => {
      const { index, field, value } = action.payload;
      const row = state.rows[index];
      row[field] = value;

      if (["quantity", "price", "taxPercent", "cgst", "sgst", "igst"].includes(field)) {
        const quantity = Number(row.quantity) || 0;
        const price = Number(row.price) || 0;
        const taxPercent = Number(row.taxPercent) || 0;

        const amount = quantity * price;
        const taxAmount = (amount * taxPercent) / 100;

        const cgst = taxPercent / 2;
        const sgst = taxPercent / 2;
        const igst = taxPercent;

        row.taxAmount = taxAmount.toFixed(2);
        row.amount = (amount + taxAmount).toFixed(2);
        row.cgst = cgst.toFixed(2);
        row.sgst = sgst.toFixed(2);
        row.igst = igst.toFixed(2);
        row.taxableAmount = amount.toFixed(2);
      }
      saveState(state);
    },
    clearProducts: (state) => {
      // Clear localStorage
      localStorage.removeItem('products');
      // Reset to initial state with one empty row
      return {
        rows: [createRow(1)]
      };
    },
    // Bulk update all rows
    updateAllRows: (state, action) => {
      state.rows = action.payload;
      saveState(state);
    }
  },
});

// Selectors
export const selectAllProducts = (state) => state.products.rows;
export const selectTotalAmount = (state) => 
  state.products.rows.reduce((sum, row) => sum + Number(row.amount), 0).toFixed(2);
export const selectTotalTaxAmount = (state) => 
  state.products.rows.reduce((sum, row) => sum + Number(row.taxAmount), 0).toFixed(2);

export const { 
  addRow, 
  removeRow, 
  updateRow, 
  clearProducts,
  updateAllRows 
} = productSlice.actions;

export default productSlice.reducer;