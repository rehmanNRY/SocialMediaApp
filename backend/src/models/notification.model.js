// notification.model.js
import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema({
  senderUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  navigateLink: {
    type: String,
    required: true,
    default: '/',
  },
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export const Notification = mongoose.model('Notification', NotificationSchema);