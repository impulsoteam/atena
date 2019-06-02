import mongoose from "mongoose"

const rangeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
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
  ranges: [
    {
      type: rangeSchema,
      require: true
    }
  ]
})

const achievementTemporaryDataSchema = new mongoose.Schema({
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
  endDate: {
    type: Date,
    required: true,
    default: Date.now()
  },
  ratings: [ratingSchema]
})

export default mongoose.model(
  "AchievementTemporaryData",
  achievementTemporaryDataSchema,
  "achievementsTemporaryData"
)
