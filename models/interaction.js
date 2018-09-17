import mongoose from "mongoose";

mongoose.set("useCreateIndex", true);

const interactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  channel: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  thread: {
    type: Boolean,
    required: true
  },
  messageIdentifier: {
    type: String,
    required: false
  },
  parentMessage: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
});

export default mongoose.model("Interaction", interactionSchema);
