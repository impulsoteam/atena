import mongoose from 'mongoose'

const achievement = {
  _id: false,
  name: {
    type: String,
    required: true
  },
  displayNames: {
    medal: {
      type: String,
      enum: ['Bronze', 'Prata', 'Ouro', 'Platina', 'Diamante']
    },
    achievement: {
      type: String,
      required: true
    }
  },
  medal: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond']
  },
  range: {
    type: String,
    enum: ['I', 'II', 'III', 'IV', 'V']
  },
  currentValue: {
    type: Number,
    required: true
  },
  nextTarget: Number,
  earnedIn: {
    type: Date,
    required: true
  }
}

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
    achievements: [achievement],
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
