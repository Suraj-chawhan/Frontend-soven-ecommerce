import { configureStore } from "@reduxjs/toolkit";
import toggleReducer from "./cartToggle"; // Existing toggle reducer

export const store = configureStore({
  reducer: {
    toggle: toggleReducer, // Existing toggle slice
    // New initialAdmin slice
  },
});

export default store;
