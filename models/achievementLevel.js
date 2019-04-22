import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
  name: String,
  range: String,
  level: Number,
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
  ranges: [
    {
      type: rangeSchema,
      require: true
    }
  ]
});

const achievementLevelSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  record: {
    type: recordSchema
  },
  ratings: [
    {
      type: ratingSchema,
      required: true
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

export default mongoose.model(
  "AchievementLevel",
  achievementLevelSchema,
  "achievementsLevel"
);
