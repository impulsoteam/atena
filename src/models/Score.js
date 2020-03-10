import mongoose from 'mongoose'
import moment from 'moment'

export const providers = {
  rocketchat: 'rocketchat'
}
const scoreSchema = new mongoose.Schema(
  {
    value: { type: Number, required: true },
    description: { type: String },
    user: {
      type: String,
      required: true
    },
    provider: {
      name: {
        type: String,
        enum: Object.values(providers)
      },
      messageId: {
        type: String,
        required: true
      },
      room: {
        id: {
          type: String,
          required: true
        },
        name: {
          type: String,
          required: true
        }
      }
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('Score', scoreSchema)
