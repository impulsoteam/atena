import mongoose from 'mongoose'

import { levels } from '../../config/score'

const achievement = {
  _id: false,
  name: {
    type: String,
    required: true
  },
  displayNames: {
    medal: {
      type: String,
      enum: ['Ferro', 'Bronze', 'Prata', 'Ouro', 'Diamante']
    },
    achievement: {
      type: String,
      required: true
    }
  },
  medal: {
    type: String,
    enum: ['iron', 'bronze', 'silver', 'gold', 'diamond']
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
    name: String,
    email: {
      type: String,
      required: true,
      unique: true
    },
    avatar: String,
    isCoreTeam: {
      type: Boolean,
      default: false
    },
    achievements: [achievement],
    profileCompleteness: {
      personal: {
        type: Number,
        default: 0
      },
      knowledge: {
        type: Number,
        default: 0
      },
      professional: {
        type: Number,
        default: 0
      },
      total: {
        type: Number,
        default: 0
      }
    },
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
        default: 1
      },
      scoreToNextLevel: {
        type: Number,
        default: levels[0].scoreToNextLevel
      },
      lastUpdate: Date
    },
    referrer: {
      type: { type: String },
      identification: String
    },
    lastInteraction: Date,
    slack: {
      id: String,
      username: String
    },
    github: {
      id: String,
      username: String
    },
    linkedin: {
      id: String
    },
    google: {
      id: String
    },
    anonymizedAt: Date
  },
  {
    timestamps: true
  }
)
