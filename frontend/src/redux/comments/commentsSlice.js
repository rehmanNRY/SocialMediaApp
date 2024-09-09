import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance'; // Import your configured axios instance

// Async thunk to post a comment
export const postComment = createAsyncThunk(
  'comments/postComment',
  async ({ post, content }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/comments/post', { post, content });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to edit a comment
export const editComment = createAsyncThunk(
  'comments/editComment',
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put('/comments/edit', { commentId, content });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to delete a comment
export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete('/comments/delete', {
        data: { commentId },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to get all comments of a specific post
export const getCommentsByPost = createAsyncThunk(
  'comments/getCommentsByPost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/comments/post/${postId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to like or dislike a comment
export const toggleLikeComment = createAsyncThunk(
  'comments/toggleLikeComment',
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/comments/like', { commentId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to get the list of all users who liked a comment
export const getUsersWhoLikedComment = createAsyncThunk(
  'comments/getUsersWhoLikedComment',
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/comments/likes/${commentId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postComment.fulfilled, (state, action) => {
        state.comments.push(action.payload.data);
      })
      .addCase(editComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          (comment) => comment._id === action.payload.data._id
        );
        if (index !== -1) {
          state.comments[index] = action.payload.data;
        }
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.meta.arg
        );
      })
      .addCase(getCommentsByPost.fulfilled, (state, action) => {
        state.comments = action.payload.data;
      })
      .addCase(toggleLikeComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          (comment) => comment._id === action.payload.data._id
        );
        if (index !== -1) {
          state.comments[index] = action.payload.data;
        }
      })
      .addCase(getUsersWhoLikedComment.fulfilled, (state, action) => {
        const comment = state.comments.find(
          (comment) => comment._id === action.meta.arg
        );
        if (comment) {
          comment.likes = action.payload.data;
        }
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

export default commentsSlice.reducer;
