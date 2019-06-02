import mongoose from "mongoose"

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
  ranges: [
    {
      type: rangeSchema,
      require: true
    }
  ]
})

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  kind: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  total: {
    type: Number,
    require: true
  },
  ratings: [
    {
      type: ratingSchema,
      require: true
    }
  ]
})

export default mongoose.model("Achievement", achievementSchema)
