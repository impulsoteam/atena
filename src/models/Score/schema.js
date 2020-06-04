import mongoose from 'mongoose'

export const providers = {
  rocketchat: 'rocketchat'
}

export const scoreTypes = {
  clickOnProduct: 'clickOnProduct',
  inactivity: 'inactivity',
  manual: 'manual',
  messageSent: 'messageSent',
  newAchievement: 'newAchievement',
  newsletterRead: 'newsletterRead',
  profileCompleteness: 'profileCompleteness',
  reactionReceived: 'reactionReceived',
  reactionRemoved: 'reactionRemoved',
  reactionSended: 'reactionSended',
  threadAnswered: 'threadAnswered'
}

export default new mongoose.Schema(
  {
    score: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      enum: Object.values(scoreTypes)
    },
    user: {
      type: String,
      required: true
    },
    details: {
      email: Object,
      provider: String,
      messageId: String,
      content: String,
      sender: String,
      reason: String,
      room: Object,
      percentage: Number,
      achievement: String,
      medal: String,
      range: String,
      product: String,
      occurredAt: Date
    }
  },
  {
    timestamps: true
  }
)
