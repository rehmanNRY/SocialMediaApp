import mongoose, {Schema} from "mongoose"

const CommentSchema = new Schema({
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxLength: 500,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {timestamps: true});

export const Comment = mongoose.model('Comment', CommentSchema);