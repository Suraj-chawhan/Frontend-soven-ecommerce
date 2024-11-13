// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import toggleReducer from './cartToggle';

export const store = configureStore({
  reducer: {
    toggle: toggleReducer,
    },
});

export default store;
