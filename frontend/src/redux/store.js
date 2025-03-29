import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './users/usersSlice';
import friendRequestsReducer from './friendRequests/friendRequestsSlice';
import postsReducer from './posts/postsSlice';
import authReducer  from './auth/authSlice';
import commentsReducer  from './comments/commentsSlice';
import savedItemsReducer  from './savedItems/savedItemsSlice';
import storyReducer  from './story/storySlice';
import notificationsReducer  from './notifications/notificationsSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    friendRequests: friendRequestsReducer,
    posts: postsReducer,
    auth: authReducer,
    comments: commentsReducer,
    savedItems: savedItemsReducer,
    story: storyReducer,
    notifications: notificationsReducer,
  },
});

export default store;