import mongoose from 'mongoose'

export default new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    avatar: {
      type: String,
      required: true
    },
    isCoreTeam: {
      type: Boolean,
      default: false
    },
    achievements: Array,
    score: {
      value: {
        type: Number,
        default: 0
      },
      lastUpdate: Date
    },
    level: {
      value: {
        type: Number,
        default: 0
      },
      scoreToNextLevel: Number,
      lastUpdate: Date
    },
    lastInteraction: Date,
    rocketchat: {
      id: String,
      username: String
    },
    slack: {
      id: String,
      username: String
    },
    linkedin: {
      id: String
    },
    google: {
      id: String
    }
  },
  {
    timestamps: true
  }
)
