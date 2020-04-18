import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
      text: true
    },
    name: {
      type: String,
      required: true,
      text: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      text: true
    },
    avatar: {
      type: String,
      required: true,
      text: true
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
    rocketchat: {
      id: String,
      name: String,
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

userSchema.statics.createOrUpdate = async function(payload) {
  const alreadyExists = await this.findOne({ uuid: payload.uuid })

  if (alreadyExists) {
    return this.findOneAndUpdate({ uuid: payload.uuid }, payload, {
      runValidators: true,
      new: true
    })
  } else {
    const user = await this.create(payload)
    return { newUser: true, user }
  }
}

userSchema.statics.updateAchievements = async function({ uuid, achievements }) {
  return this.findOneAndUpdate(
    { uuid },
    { achievements },
    {
      runValidators: true,
      upsert: true,
      setDefaultsOnInsert: true,
      new: true
    }
  )
}

userSchema.statics.updateScore = async function({ uuid, score, level }) {
  return this.findOneAndUpdate(
    { uuid },
    { score, level },
    {
      runValidators: true,
      upsert: true,
      setDefaultsOnInsert: true,
      new: true
    }
  )
}

userSchema.statics.deleteUserData = async function(uuid) {
  const { deletedCount } = await this.deleteOne({ uuid })
  if (deletedCount) {
    const scores = await mongoose.model('Score').deleteMany({ user: uuid })
    const messages = await mongoose.model('Message').deleteMany({ user: uuid })

    const reactions = await mongoose
      .model('Reaction')
      .deleteMany({ user: uuid })

    const levels = await mongoose
      .model('LevelHistory')
      .deleteMany({ user: uuid })

    return { scores, reactions, messages, levels }
  }
  return { notFound: true }
}

export default mongoose.model('User', userSchema)
