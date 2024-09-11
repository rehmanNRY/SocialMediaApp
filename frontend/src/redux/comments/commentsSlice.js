import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

// Async thunk to post a comment
// Async thunk to post a comment
export const postComment = createAsyncThunk(
  'comments/postComment',
  async ({ post, content }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/comments/post', { post, content });
      return { postId: post, comment: response.data.data }; // Return both postId and the new comment
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


// Async thunk to edit a comment
export const editComment = createAsyncThunk(
  'comments/editComment',
  async ({ commentId, postId, content }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put('/comments/edit', { commentId, content });
      return { postId, comment: response.data.data }; // Return both postId and updated comment
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


// Async thunk to delete a comment
export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async ({ commentId, postId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete('/comments/delete', { data: { commentId } });
      return { postId, commentId }; // Return both postId and commentId
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
      return { postId, comments: response.data.data }; // Return both postId and comments
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to like or dislike a comment
export const toggleLikeComment = createAsyncThunk(
  'comments/toggleLikeComment',
  async ({ commentId, postId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/comments/like', { commentId });
      return { postId, comment: response.data.data }; // Return both postId and updated comment
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
  name: "comments",
  initialState: {
    commentsByPostId: {}, // Store comments for each post separately
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(postComment.fulfilled, (state, action) => {
      const { postId, comment } = action.payload;
      if (state.commentsByPostId[postId]) {
        state.commentsByPostId[postId].push(comment);
      } else {
        state.commentsByPostId[postId] = [comment];
      }
    })
      .addCase(getCommentsByPost.fulfilled, (state, action) => {
        const { postId, comments } = action.payload;
        state.commentsByPostId[postId] = comments;
      })
      .addCase(editComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        const index = state.commentsByPostId[postId]?.findIndex((c) => c._id === comment._id);
        if (index !== -1) {
          state.commentsByPostId[postId][index] = comment; // Update the comment in the state
        }
      })
      .addCase(toggleLikeComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        const index = state.commentsByPostId[postId]?.findIndex((c) => c._id === comment._id);
        if (index !== -1) {
          state.commentsByPostId[postId][index] = comment; // Update the liked/unliked comment in the state
        }
      })  
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { postId, commentId } = action.payload;
        state.commentsByPostId[postId] = state.commentsByPostId[postId]?.filter(
          (comment) => comment._id !== commentId
        );
      });      
  },
});

export default commentsSlice.reducer;
