import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
  name: String,
  range: String,
  total: Number,
  earnedDate: Date
});

const rangeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  earnedDate: {
    type: Date,
    required: false
  }
});

const ratingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  xp: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    require: true,
    default: 0
  },
  ranges: [
    {
      type: rangeSchema,
      require: true
    }
  ]
});

const achievementTemporarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  kind: {
    type: String,
    required: true
  },
  dataId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AchievementTemporaryData"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  rangeTime: {
    type: String,
    enum: ["daily", "weekly", "monthly", "yearly"],
    required: true
  },
  initialDate: {
    type: Date,
    required: true,
    default: Date.now()
  },
  limitDate: {
    type: Date,
    required: true,
    default: Date.now()
  },
  endDate: {
    type: Date,
    required: true,
    default: Date.now()
  },
  lastEarnedDate: {
    type: Date,
    required: false
  },
  record: {
    type: recordSchema
  },
  ratings: [ratingSchema]
});

export default mongoose.model(
  "AchievementTemporary",
  achievementTemporarySchema,
  "achievementsTemporary"
);