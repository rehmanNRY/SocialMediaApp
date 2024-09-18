import mongoose, { Schema } from "mongoose";

const StorySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    maxLength: 255,  // Ensure content does not exceed 255 characters
  },
  image: {
    type: String,
  },
  expiresAt: {
    type: Date,
    default: () => Date.now() + 24 * 60 * 60 * 1000,  // Expire in 24 hours
  },
}, {timestamps: true});

export const Story = mongoose.model('Story', StorySchema);