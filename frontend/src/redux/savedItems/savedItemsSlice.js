import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance'; // Import your configured axios instance

// Async thunk to add an item to saves
export const addItemToSaves = createAsyncThunk(
  'savedItems/addItemToSaves',
  async ({ post }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/saved/add', { post });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to remove an item from saves
export const removeItemFromSaves = createAsyncThunk(
  'savedItems/removeItemFromSaves',
  async ({ post }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/saved/remove', { post });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to get all saved items of the logged-in user
export const getAllSaves = createAsyncThunk(
  'savedItems/getAllSaves',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/saved/all');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const savedItemsSlice = createSlice({
  name: 'savedItems',
  initialState: {
    savedItems: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addItemToSaves.fulfilled, (state, action) => {
        state.savedItems.push(action.payload.data);
      })
      .addCase(removeItemFromSaves.fulfilled, (state, action) => {
        state.savedItems = state.savedItems.filter(
          (item) => item.post._id !== action.meta.arg.post
        );
      })
      .addCase(getAllSaves.fulfilled, (state, action) => {
        state.savedItems = action.payload.data;
      })
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload || action.error.message;
        }
      );
  },
});

export default savedItemsSlice.reducer;
