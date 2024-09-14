import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

// Thunks for Friend Request API calls

// Send a friend request
export const sendFriendRequest = createAsyncThunk(
  'friendRequests/sendFriendRequest',
  async (receiverId, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.post('/friendRequests/send', { receiverId });
      dispatch(fetchSentRequests()); // Ensure this is called only after successful request
      return response.data.data;
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
      return { data: response.data, requestId };

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
      const response = await axiosInstance.delete('/friendRequests/reject', { data: { requestId } });
      return { data: response.data, requestId };
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

// Cancel a sent friend request
export const cancelSentRequest = createAsyncThunk(
  'friendRequests/cancelSentRequest',
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete('/friendRequests/cancel', { data: { requestId } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Unfriend a friend
export const unfriend = createAsyncThunk(
  'friendRequests/unfriend',
  async (friendId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete('/friendRequests/unfriend', { data: { friendId } });
      return { data: response.data, friendId };
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
    builder
    .addCase(sendFriendRequest.fulfilled, (state, action) => {
      state.sentRequests.push(action.payload);
    })    
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        const acceptedRequestId = action.payload.requestId;
        state.receivedRequests = state.receivedRequests.filter(
          (req) => req._id !== acceptedRequestId
        );
        state.friendsList.push(action.payload.data);
      })
      .addCase(rejectFriendRequest.fulfilled, (state, action) => {
        const rejectedRequestId = action.payload.requestId;
        state.receivedRequests = state.receivedRequests.filter(
          (req) => req._id !== rejectedRequestId
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
      .addCase(cancelSentRequest.fulfilled, (state, action) => {
        const canceledRequestId = action.meta.arg;
        state.sentRequests = state.sentRequests.filter(
          (req) => req._id !== canceledRequestId
        );
      })
      .addCase(unfriend.fulfilled, (state, action) => {
        const removedFriendId = action.payload.friendId;
        state.friendsList = state.friendsList.filter(
          (friend) => friend._id !== removedFriendId
        );
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
