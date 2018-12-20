import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  avatar: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  slackId: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
  },
  messages: {
    type: Number,
    required: false
  },
  replies: {
    type: Number,
    required: false
  },
  reactions: {
    positives: {
      type: Number,
      required: false,
      default: 0
    },
    negatives: {
      type: Number,
      required: false,
      default: 0
    },
    others: {
      type: Number,
      required: false,
      default: 0
    }
  },
  lastUpdate: {
    type: Date,
    required: true,
    default: Date.now
  },
  isCoreTeam: {
    type: Boolean,
    required: true,
    default: false
  }
});

export default mongoose.model("User", userSchema);
