import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isToggled: false, // initial state is false
};

export const toggleSlice = createSlice({
  name: 'toggle',
  initialState,
  reducers: {
    toggleState: (state) => {
      state.isToggled = !state.isToggled;  // toggle the boolean value
    },
    setTrue: (state) => {
      state.isToggled = true;
    },
    setFalse: (state) => {
      state.isToggled = false;
    },
  },
});

export const { toggleState, setTrue, setFalse } = toggleSlice.actions;

export default toggleSlice.reducer;
