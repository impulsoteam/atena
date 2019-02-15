import mongoose from "mongoose";

const userLevelHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  kind: {
    type: String,
    enum: ["added", "subtracted"],
    required: true
  },
  level: {
    type: Number,
    required: true
  },
  earnedDate: {
    type: Date,
    required: true
  }
});

export default mongoose.model(
  "UserLevelHistory",
  userLevelHistorySchema,
  "usersLevelsHistory"
);
