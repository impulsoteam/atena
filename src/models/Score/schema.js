import mongoose from 'mongoose'

export const scoreTypes = {
  clickOnProduct: 'clickOnProduct',
  manual: 'manual',
  newAchievement: 'newAchievement',
  newsletterRead: 'newsletterRead',
  profileCompleteness: 'profileCompleteness',
  subscribedToMeetup: 'subscribedToMeetup',
  participatedToMeetup: 'participatedToMeetup',
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
      content: String,
      sender: String,
      reason: String,
      room: Object,
      percentage: Number,
      achievement: String,
      medal: String,
      meetup: String,
      range: String,
      product: String,
      occurredAt: Date
    }
  },
  {
    timestamps: true
  }
)
