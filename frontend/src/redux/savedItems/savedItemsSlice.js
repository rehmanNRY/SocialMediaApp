// savedItemsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axiosInstance";

// Thunk to fetch saved items
export const fetchSavedItems = createAsyncThunk("savedItems/fetchSavedItems", async () => {
  const response = await axiosInstance.get("/saves/all");
  return response.data.data;
});

// Thunk to toggle (add or remove) a saved item
export const toggleSavedItem = createAsyncThunk(
  "savedItems/toggleSavedItem",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/saves/toggle", { post: postId });
      return { postId, isSaved: response.statusCode === 201 };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const savedItemsSlice = createSlice({
  name: "savedItems",
  initialState: {
    savedItems: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedItems.fulfilled, (state, action) => {
        state.savedItems = action.payload;
      })
      .addCase(toggleSavedItem.fulfilled, (state, action) => {
        const { postId, isSaved } = action.payload;
        if (isSaved) {
          // Add the item to savedItems if it was added
          state.savedItems.push({ post: { _id: postId } });
        } else {
          // Remove the item from savedItems if it was removed
          state.savedItems = state.savedItems.filter((item) => item.post._id !== postId);
        }
      });
  },
});

export default savedItemsSlice.reducer;
