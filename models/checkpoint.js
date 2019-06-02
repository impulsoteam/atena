import mongoose from "mongoose"

const checkpointSchema = new mongoose.Schema({
  level: {
    type: String,
    required: true
  },
  xp: {
    type: Number,
    required: true
  },
  totalEngagedUsers: {
    type: Number,
    required: true
  },
  rewards: []
})

export default mongoose.model("Checkpoint", checkpointSchema)
