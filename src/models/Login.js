import mongoose from 'mongoose'

const loginSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ['online', 'offline']
    },
    user: {
      type: String,
      required: true
    },
    provider: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

export default mongoose.model('Login', loginSchema)
