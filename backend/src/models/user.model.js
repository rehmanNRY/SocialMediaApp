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
    default: 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg',
  },
  coverImage: {
    type: String,
    default: 'https://ih1.redbubble.net/cover.4093136.2400x600.jpg',
  },
  bio: {
    type: String,
    maxLength: 160,
    default: "Using MERN app by Abdul Rehman",
  },
  location: {
    type: String,
    trim: true,
  },
  dob: {
    type: Date,
  },
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {timestamps: true});

export const User = mongoose.model('User', UserSchema);