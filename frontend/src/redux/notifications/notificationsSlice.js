import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

// Async thunk to get all notifications for the logged-in user
export const getUserNotifications = createAsyncThunk(
  'notifications/getUserNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axiosInstance.get('/notifications/all', {
        headers: {
          'auth-token': token,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to mark all notifications as read
export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllNotificationsAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axiosInstance.patch('/notifications/mark-all-read', {}, {
        headers: {
          'auth-token': token,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to mark a specific notification as read
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markNotificationAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axiosInstance.patch(`/notifications/mark-read/${notificationId}`, {}, {
        headers: {
          'auth-token': token,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to delete a specific notification
export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axiosInstance.delete(`/notifications/delete/${notificationId}`, {
        headers: {
          'auth-token': token,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    unreadCount: 0,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload.data;
        state.unreadCount = action.payload.data.filter(notification => !notification.isRead).length;
        state.status = 'succeeded';
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach(notification => {
          notification.isRead = true;
        });
        state.unreadCount = 0;
        state.status = 'succeeded';
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex((notification) => 
          notification._id === action.meta.arg
        );
        if (index !== -1) {
          if (!state.notifications[index].isRead) {
            state.notifications[index].isRead = true;
            state.unreadCount -= 1;
          }
        }
        state.status = 'succeeded';
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const deletedNotification = state.notifications.find(
          notification => notification._id === action.meta.arg
        );
        
        state.notifications = state.notifications.filter(
          notification => notification._id !== action.meta.arg
        );
        
        // If the deleted notification was unread, decrease the unread count
        if (deletedNotification && !deletedNotification.isRead) {
          state.unreadCount -= 1;
        }
        state.status = 'succeeded';
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

export default notificationsSlice.reducer;