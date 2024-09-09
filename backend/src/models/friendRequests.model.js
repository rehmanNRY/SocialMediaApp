import mongoose, {Schema} from "mongoose"

const FriendRequestSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {timestamps: true});

export const FriendRequest = mongoose.model('FriendRequest', FriendRequestSchema);