import mongoose from "mongoose"

const channelCheckPointSchema = new mongoose.Schema({
  beginDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalInteractions: {
    type: Number,
    required: false
  },
  engagedUsers: [],
  level: {
    type: String,
    required: false
  },
  qtdInteractions: {
    type: Number,
    required: true
  },
  minEngagedUsers: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: false
  },
  winUsers: [],
  channel: {
    type: String,
    required: true
  }
})

export default mongoose.model("ChannelCheckpoint", channelCheckPointSchema)
