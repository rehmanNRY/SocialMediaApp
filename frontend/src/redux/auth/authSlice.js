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
      // console.log(response.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data || 'Failed to fetch user details');
    }
  }
);

// Create the auth slice
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetails = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { setLoggedIn, logout } = authSlice.actions;
export default authSlice.reducer;