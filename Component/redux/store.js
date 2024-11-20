import { configureStore } from '@reduxjs/toolkit';
import toggleReducer from './cartToggle'; // Existing toggle reducer
import adminReducer from './adminSlice'; // New initialAdmin reducer

export const store = configureStore({
  reducer: {
    toggle: toggleReducer,       // Existing toggle slice
    initialAdmin: adminReducer, // New initialAdmin slice
  },
});

export default store;
