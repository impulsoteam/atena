import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    score: {
      type: Number,
      required: true
    },
    on: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'onModel',
      required: true
    },
    onModel: {
      type: String,
      enum: ['Message', 'Reaction'],
      required: true
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('Score', schema)
