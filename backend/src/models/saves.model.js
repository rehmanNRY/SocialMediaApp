import mongoose, {Schema} from "mongoose"

const SavedItemSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
});

export const SavedItem = mongoose.model('SavedItem', SavedItemSchema);