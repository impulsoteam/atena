import mongoose from 'mongoose'

const loginSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ['online', 'offline']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('Login', loginSchema)
