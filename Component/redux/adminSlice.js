import { createSlice } from '@reduxjs/toolkit';

// Define the initial state
const initialState = {
  isAdmin: false, // Use `isAdmin` as the boolean value
};

// Create the slice
export const adminSlice = createSlice({
  name: 'initialAdmin', // Slice name
  initialState,
  reducers: {
    toggleAdmin: (state) => {
      state.isAdmin = !state.isAdmin; // Toggle the value
    },
    setAdminTrue: (state) => {
      state.isAdmin = true; // Set the value to true
    },
    setAdminFalse: (state) => {
      state.isAdmin = false; // Set the value to false
    },
  },
});

// Export actions
export const { toggleAdmin, setAdminTrue, setAdminFalse } = adminSlice.actions;

// Export the reducer
export default adminSlice.reducer;
