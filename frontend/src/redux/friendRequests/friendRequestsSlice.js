import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

// Thunks for Friend Request API calls

// Send a friend request
export const sendFriendRequest = createAsyncThunk(
  'friendRequests/sendFriendRequest',
  async (receiverId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/friendRequests/send', { receiverId });
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Accept a friend request
export const acceptFriendRequest = createAsyncThunk(
  'friendRequests/acceptFriendRequest',
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/friendRequests/accept', { requestId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Reject or delete a friend request
export const rejectFriendRequest = createAsyncThunk(
  'friendRequests/rejectFriendRequest',
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/friendRequests/reject', { requestId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch sent friend requests
export const fetchSentRequests = createAsyncThunk(
  'friendRequests/fetchSentRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/friendRequests/sent');
      console.log("fds",response.data)
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch received friend requests
export const fetchReceivedRequests = createAsyncThunk(
  'friendRequests/fetchReceivedRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/friendRequests/received');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch the user's friends list
export const fetchFriendsList = createAsyncThunk(
  'friendRequests/fetchFriendsList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/friendRequests/friends');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const friendRequestsSlice = createSlice({
  name: 'friendRequests',
  initialState: {
    sentRequests: [],
    receivedRequests: [],
    friendsList: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        state.sentRequests.push(action.payload);
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        state.receivedRequests = state.receivedRequests.filter(
          (req) => req.id !== action.payload.requestId
        );
        state.friendsList.push(action.payload);
      })
      .addCase(rejectFriendRequest.fulfilled, (state, action) => {
        state.receivedRequests = state.receivedRequests.filter(
          (req) => req.id !== action.payload.requestId
        );
      })
      .addCase(fetchSentRequests.fulfilled, (state, action) => {
        state.sentRequests = action.payload;
      })
      .addCase(fetchReceivedRequests.fulfilled, (state, action) => {
        state.receivedRequests = action.payload;
      })
      .addCase(fetchFriendsList.fulfilled, (state, action) => {
        state.friendsList = action.payload;
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

export default friendRequestsSlice.reducer;
