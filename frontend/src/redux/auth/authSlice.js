// slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Function to check if the user is logged in based on the token in localStorage
const getInitialAuthState = () => {
  if (typeof window !== 'undefined') { // Check if window is defined
    const token = localStorage.getItem('authToken');
    return !!token; // Return true if token exists, otherwise false
  }
  return false; // Default to false for SSR
};

const initialState = {
  isLoggedIn: getInitialAuthState(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoggedIn(state, action) {
      state.isLoggedIn = action.payload;
      if (!action.payload) {
        localStorage.removeItem('authToken');
      } else {
        console.log(action.payload)
        // localStorage.setItem('authToken', 'your-auth-token'); // Replace with actual token
      }
    },
    logout(state) {
      state.isLoggedIn = false;
      localStorage.removeItem('authToken');
    },
  },
});

export const { setLoggedIn, logout } = authSlice.actions;
export default authSlice.reducer;