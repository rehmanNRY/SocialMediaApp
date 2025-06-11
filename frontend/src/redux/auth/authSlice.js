import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';
import axiosInstance from '@/api/axiosInstance';

// Function to check if the user is logged in based on the token in localStorage
const getInitialAuthState = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    return !!token;
  }
  return false;
};

// Define the initial state
const initialState = {
  isLoggedIn: getInitialAuthState(),
  userDetails: null,
  loading: false,
  error: null,
};

// Async thunk to fetch user details
export const fetchUserDetails = createAsyncThunk(
  'auth/fetchUserDetails',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/user/me');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || 'Failed to fetch user details');
    }
  }
);

// Async thunk for complete logout (handles both NextAuth and custom auth)
export const performLogout = createAsyncThunk(
  'auth/performLogout',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Clear localStorage token
      localStorage.removeItem('authToken');
      
      // Clear any other auth-related data from localStorage
      localStorage.removeItem('userDetails');
      // Add any other localStorage keys you want to clear
      
      // Sign out from NextAuth (this clears NextAuth cookies)
      await signOut({
        redirect: false, // Don't redirect automatically
        callbackUrl: '/' // Specify where to redirect after logout
      });
      
      // Optional: Clear all cookies manually if needed
      // This is usually not necessary as NextAuth handles its own cookies
      // But if you have custom auth cookies, you can clear them here
      if (typeof window !== 'undefined') {
        // Clear specific cookies if you have custom ones
        document.cookie.split(";").forEach((c) => {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
      }
      
      return true;
    } catch (error) {
      return rejectWithValue('Logout failed');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoggedIn(state, action) {
      state.isLoggedIn = action.payload;
      if (!action.payload) {
        localStorage.removeItem('authToken');
        state.userDetails = null;
      }
    },
    logout(state) {
      state.isLoggedIn = false;
      localStorage.removeItem('authToken');
      state.userDetails = null;
      state.error = null;
    },
    updateUserDetails(state, action) {
      state.userDetails = action.payload;
    },
    // Clear all auth state
    clearAuthState(state) {
      state.isLoggedIn = false;
      state.userDetails = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetails = action.payload.data;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        if (action.payload?.error === 'Pls authenticate using a valid token') {
          state.isLoggedIn = false;
          localStorage.removeItem('authToken');
          state.userDetails = null;
        }
      })
      // Handle performLogout async thunk
      .addCase(performLogout.pending, (state) => {
        state.loading = true;
      })
      .addCase(performLogout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.userDetails = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(performLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Even if logout fails, clear the state
        state.isLoggedIn = false;
        state.userDetails = null;
      });
  },
});

export const { setLoggedIn, logout, updateUserDetails, clearAuthState } = authSlice.actions;
export default authSlice.reducer;