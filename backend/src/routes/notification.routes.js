// notification.routes.js
import express from 'express';
import { fetchUser } from '../middleware/fetchUser.js';
import { 
  getUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  deleteNotification
} from '../controllers/notification.controllers.js';

const router = express.Router();

// Route to get all notifications of the logged-in user
router.get('/all', fetchUser, getUserNotifications);

// Route to mark all notifications as read
router.patch('/mark-all-read', fetchUser, markAllNotificationsAsRead);

// Route to mark a specific notification as read
router.patch('/mark-read/:notificationId', fetchUser, markNotificationAsRead);

// Route to delete a specific notification
router.delete('/delete/:notificationId', fetchUser, deleteNotification);

export default router;