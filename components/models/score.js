import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    value: { type: Number, required: true },
    description: { type: String },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    ref: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'refModel',
      required: true
    },
    refModel: {
      type: String,
      enum: ['Message', 'Reaction'],
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
)

export default mongoose.model('Score', schema)
