import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    interaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interaction',
      required: true
    },
    reaction: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      default: 0
    },
    username: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('Reaction', schema)
