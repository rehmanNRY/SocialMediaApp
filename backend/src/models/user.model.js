import mongoose, { Schema } from 'mongoose';
import validator from 'validator';

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [3, 'Full name must be at least 3 characters long'],
    maxlength: [30, 'Full name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email address',
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  profilePicture: {
    type: String,
    default: 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg',
    validate: {
      validator: validator.isURL,
      message: 'Invalid URL format for profile picture',
    },
  },
  coverImage: {
    type: String,
    default: 'https://ih1.redbubble.net/cover.4093136.2400x600.jpg',
    validate: {
      validator: validator.isURL,
      message: 'Invalid URL format for cover image',
    },
  },
  bio: {
    type: String,
    maxlength: [100, 'Bio cannot exceed 100 characters'],
    default: '✨ Crafting cool apps with MERN! 💻',
  },
  location: {
    type: String,
    trim: true,
    maxlength: [30, 'Location cannot exceed 100 characters'],
  },
  dob: {
    type: Date,
    validate: {
      validator: function(value) {
        // Ensure the user is at least 13 years old
        const ageLimit = 13;
        const birthDate = new Date(value);
        const currentDate = new Date();
        const age = currentDate.getFullYear() - birthDate.getFullYear();
        return age >= ageLimit;
      },
      message: 'You must be at least 13 years old',
    },
  },
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
}, { timestamps: true });

export const User = mongoose.model('User', UserSchema);