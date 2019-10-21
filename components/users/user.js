import mongoose from 'mongoose'
import errors from '../errors'
import api from '../axios'

const userSchema = new mongoose.Schema({
  avatar: {
    type: String,
    required: false
  },
  uuid: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: true,
    text: true
  },
  username: {
    type: String,
    required: false
  },
  level: {
    type: Number,
    required: true,
    default: 1
  },
  score: {
    type: Number,
    required: true,
    default: 0
  },
  slackId: {
    type: String,
    required: false
  },
  nextStep: {
    type: String,
    required: false
  },
  rocketId: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  messages: {
    type: Number,
    required: false,
    default: 0
  },
  replies: {
    type: Number,
    required: false,
    default: 0
  },
  reactions: {
    positives: {
      type: Number,
      required: false,
      default: 0
    },
    negatives: {
      type: Number,
      required: false,
      default: 0
    },
    others: {
      type: Number,
      required: false,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  },
  lastInteraction: {
    type: Date,
    default: Date.now
  },
  isCoreTeam: {
    type: Boolean,
    required: true,
    default: false
  },
  githubId: {
    type: String,
    required: false
  },
  disqusUsername: {
    type: String,
    required: false
  },
  teams: {
    type: Array,
    default: ['network'],
    required: false
  },
  linkedinId: {
    type: String,
    required: false
  },
  pro: {
    type: Boolean,
    default: false
  },
  proBeginAt: {
    type: Date,
    required: false
  },
  proFinishAt: {
    type: Date,
    required: false
  }
})

userSchema.pre('save', function(next) {
  this.lastUpdate = Date.now()
  this.wasNew = this.isNew
  next()
})

userSchema.post('save', function() {
  if (this.wasNew) {
    api.onboardingApi.sendOnboardingMessage(this.username)
  }
})
userSchema.post('remove', async function() {
  const AchievementsModel = mongoose.model('Achievement')
  const AchievementsLevelModel = mongoose.model('AchievementLevel')
  const InteractionsModel = mongoose.model('Interaction')
  const LoginsModel = mongoose.model('Login')
  const UsersLevelsHistoryModel = mongoose.model('UserLevelHistory')
  const userId = this._id
  try {
    const achievements = await AchievementsModel.deleteMany({ user: userId })
    const level = await AchievementsLevelModel.deleteMany({
      user: userId
    })
    const interactions = await InteractionsModel.deleteMany({ user: userId })
    const logins = await LoginsModel.deleteMany({ user: userId })
    const history = await UsersLevelsHistoryModel.deleteMany({ user: userId })

    return { achievements, level, interactions, logins, history }
  } catch (error) {
    errors._throw('User Schema', 'removeUser', error)
  }
})

export default mongoose.model('User', userSchema)
