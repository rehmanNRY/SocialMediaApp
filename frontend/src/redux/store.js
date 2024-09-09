import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './users/usersSlice';
import friendRequestsReducer from './friendRequests/friendRequestsSlice';
import postsReducer from './posts/postsSlice';
import authReducer  from './auth/authSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    friendRequests: friendRequestsReducer,
    posts: postsReducer,
    auth: authReducer,
  },
});

export default store;