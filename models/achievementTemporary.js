import mongoose from "mongoose";

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
  ranges: [
    {
      type: rangeSchema,
      require: true
    }
  ]
});

const achievementTemporySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  kind: {
    type: String,
    required: true
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
  record: {
    type: ratingSchema
  },
  ratings: [ratingSchema]
});

export default mongoose.model(
  "AchievementTempory",
  achievementTemporySchema,
  "achievementTempory"
);
