import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './users/usersSlice';
import friendRequestsReducer from './friendRequests/friendRequestsSlice';
import postsReducer from './posts/postsSlice';
import authReducer  from './auth/authSlice';
import commentsReducer  from './comments/commentsSlice';
import savedItemsReducer  from './savedItems/savedItemsSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    friendRequests: friendRequestsReducer,
    posts: postsReducer,
    auth: authReducer,
    comments: commentsReducer,
    savedItems: savedItemsReducer,
  },
});

export default store;