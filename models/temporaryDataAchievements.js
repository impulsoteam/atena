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
  ranges: [
    {
      type: rangeSchema,
      require: true
    }
  ]
});

const temporaryAchievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  kind: {
    type: String,
    required: true
  },
  total: {
    type: Number,
    require: true
  },
  rangeTime: {
    type: String,
    enum: ["daily", "weekly", "monthly", "yearly"],
    required: true
  },
  record: {
    type: String //rating
  },
  lastDate: {
    type: Date,
    required: true,
    default: Date.now()
  },
  ratings: [
    {
      name: "Bronze",
      range: 10,
      earnedDate: "hoje",
      xp: 7
    },
    {
      name: "Prata",
      range: 20,
      earnedDate: null,
      xp: 7
    }
  ]
});

export default mongoose.model(
  "TemporaryAchievement",
  temporaryAchievementSchema
);
