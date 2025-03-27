// savedItemsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axiosInstance";

// Thunk to fetch saved items
export const fetchSavedItems = createAsyncThunk("savedItems/fetchSavedItems", async (_, rejectWithValue) => {
  try {
    const response = await axiosInstance.get("/saves/all");
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Thunk to toggle (add or remove) a saved item
export const toggleSavedItem = createAsyncThunk(
  "savedItems/toggleSavedItem",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/saves/toggle", { post: postId });
      // Check if the item was saved (status 201) or removed (status 200)
      return { postId, isSaved: response.data.statusCode === 201 };
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
      // Handle fetchSavedItems states
      .addCase(fetchSavedItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSavedItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.savedItems = action.payload;
        state.error = null;
      })
      .addCase(fetchSavedItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch saved items";
      })
      
      // Handle toggleSavedItem states
      .addCase(toggleSavedItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(toggleSavedItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { postId, isSaved } = action.payload;
        
        if (isSaved) {
          // Add the item to savedItems if it was added
          state.savedItems.push({ post: { _id: postId } });
        } else {
          // Remove the item from savedItems if it was removed
          state.savedItems = state.savedItems.filter((item) => item.post?._id !== postId);
        }
        
        state.error = null;
      })
      .addCase(toggleSavedItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to toggle saved item";
      });
  },
});

export default savedItemsSlice.reducer;
