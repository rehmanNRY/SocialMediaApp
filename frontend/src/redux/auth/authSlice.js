import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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

// Add this to the authSlice
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
    },
    // Add this new reducer
    updateUserDetails(state, action) {
      state.userDetails = action.payload;
    },
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
      });
  },
});

// Export the new action
export const { setLoggedIn, logout, updateUserDetails } = authSlice.actions;
export default authSlice.reducer;