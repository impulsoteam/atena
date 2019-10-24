import mongoose from 'mongoose'

const githubSchema = new mongoose.Schema({
  excludedUsers: [
    {
      userId: {
        type: String
      }
    }
  ],
  repositoryId: {
    type: String,
    required: true,
    index: { unique: true }
  }
})

export default mongoose.model('Github', githubSchema)
