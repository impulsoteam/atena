import mongoose from "mongoose"

const recordSchema = new mongoose.Schema({
  name: String,
  range: String,
  total: Number,
  earnedDate: Date
})

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
})

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
})

const achievementTemporarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  kind: {
    type: String,
    required: true
  },
  temporaryData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AchievementTemporaryData",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  rangeTime: {
    type: String,
    enum: ["daily", "weekly", "monthly", "yearly"],
    required: true
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now()
  },
  lastEarnedDate: {
    type: Date,
    required: false
  },
  total: {
    type: Number,
    require: true,
    default: 0
  },
  record: {
    type: recordSchema
  },
  ratings: [ratingSchema]
})

export default mongoose.model(
  "AchievementTemporary",
  achievementTemporarySchema,
  "achievementsTemporary"
)
