import mongoose, {Schema} from "mongoose"

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    maxLength: 1000,
    required: true
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