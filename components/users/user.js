import mongoose, { mongo } from 'mongoose'

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
  this.lastUpdate = Date.Now
  next()
})

userSchema.pre('deleteMany', async function() { 
  const conditions = await this.find(this._conditions).distinct('_id').then(ids => ({ user: { $in: ids } }))
  const models = ['Interaction', 'UserLevelHistory', 'AchievementLevel', 'AchievementTemporary', 'Achievement']
  models.forEach(async model => await mongoose.model(model).deleteMany(conditions))
})

export default mongoose.model('User', userSchema)
