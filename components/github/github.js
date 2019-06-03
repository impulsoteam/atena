import mongoose from 'mongoose'

const githubSchema = new mongoose.Schema({
  excludedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  repositoryId: {
    type: String,
    required: true,
    index: { unique: true }
  }
})

export default mongoose.model('Github', githubSchema)
