import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNpTKcwSR1d8nsU3xEVHSwOYbq9VM9Fz65p8AeAuJEn31XiwoB5ApWSLFq8PTIjWJ0e3Y&usqp=CAU',
  },
  bio: {
    type: String,
    maxLength: 160,
    default: "Using MERN app by Abdul Rehman",
  },
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {timestamps: true});

export const User = mongoose.model('User', UserSchema);