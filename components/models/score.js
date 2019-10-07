import mongoose from 'mongoose'
import moment from 'moment'

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

schema.statics.currentDateTotalScore = function(user) {
  const today = moment()
    .startOf('day')
    .toDate()

  return this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(user),
        createdAt: { $gt: today }
      }
    },
    {
      $group: {
        _id: '$user',
        score: { $sum: '$value' }
      }
    }
  ]).then(response => (response[0] ? response[0].score : 0))
}

export default mongoose.model('Score', schema)
