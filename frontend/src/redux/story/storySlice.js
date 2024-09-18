import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

// Thunk for creating a story
export const createStory = createAsyncThunk(
  'stories/createStory',
  async ({ content, image }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/story/create', { content, image });
      return response.data; // Return the created story
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Error creating story');
    }
  }
);

// Thunk for deleting a story by ID
export const deleteStory = createAsyncThunk(
  'stories/deleteStory',
  async (storyId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/story/${storyId}`);
      return { storyId, message: response.data.message }; // Return deleted story ID for updating the state
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Error deleting story');
    }
  }
);

// Thunk for auto-deleting stories older than 24 hours
export const autoDeleteStories = createAsyncThunk(
  'stories/autoDeleteStories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete('/story/auto-delete');
      return response.data; // Return result of auto-delete
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Error auto-deleting stories');
    }
  }
);

// Thunk for fetching all stories
export const fetchAllStories = createAsyncThunk(
  'stories/fetchAllStories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/story');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Error fetching stories');
    }
  }
);

const initialState = {
  stories: [],
  loading: false,
  error: null,
};

const storySlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle createStory
    builder
      .addCase(createStory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStory.fulfilled, (state, action) => {
        state.loading = false;
        state.stories.unshift(action.payload.data);
      })
      .addCase(createStory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle deleteStory
    builder
      .addCase(deleteStory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStory.fulfilled, (state, action) => {
        state.loading = false;
        state.stories = state.stories.filter(
          (story) => story._id !== action.payload.storyId
        ); // Remove story from state
      })
      .addCase(deleteStory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle autoDeleteStories
    builder
      .addCase(autoDeleteStories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(autoDeleteStories.fulfilled, (state, action) => {
        state.loading = false;
        // Implement any state updates related to auto-deleted stories if needed
      })
      .addCase(autoDeleteStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle fetchAllStories
    builder
      .addCase(fetchAllStories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllStories.fulfilled, (state, action) => {
        state.loading = false;
        state.stories = action.payload; // Update state with fetched stories
      })
      .addCase(fetchAllStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default storySlice.reducer;
