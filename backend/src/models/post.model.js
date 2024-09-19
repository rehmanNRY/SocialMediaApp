import mongoose, {Schema} from "mongoose"

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    maxLength: [100, 'Post cannot exceed 100 characters'],
    required: true,
  },
  image: {
    type: String,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],

},{timestamps: true});

export const Post = mongoose.model('Post', PostSchema);