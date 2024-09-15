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