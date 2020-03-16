import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: false
    },
    name: {
      type: String,
      required: true,
      text: true
    },
    email: {
      type: String,
      required: false
    },
    isCoreTeam: {
      type: Boolean,
      required: true,
      default: false
    },
    achievements: Array,
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
    },
    pro: {
      isPro: {
        type: Boolean,
        default: false
      },
      beginAt: {
        type: Date,
        required: false
      },
      finishAt: {
        type: Date,
        required: false
      }
    }
  },
  {
    timestamps: true
  }
)

// userSchema.post('save', function() {
//   if (this.wasNew) {
//     api.onboardingApi.sendOnboardingMessage(this.username)
//   }
// })
// userSchema.post('remove', async function() {
//   const user = this._id
//   try {
//     await Promise.all([
//       mongoose.model('Achievement').deleteMany({ user }),
//       mongoose.model('AchievementLevel').deleteMany({ user }),
//       mongoose.model('Interaction').deleteMany({ user }),
//       mongoose.model('Login').deleteMany({ user }),
//       mongoose.model('UserLevelHistory').deleteMany({ user })
//     ])
//   } catch (error) {
//     errors._throw('User Schema', 'removeUser', error)
//   }
// })

export default mongoose.model('User', userSchema)
