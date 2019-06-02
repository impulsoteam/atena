import mongoose from "mongoose"

const updateUserData = (slackId, disqusUsername) => {
  const UserModel = mongoose.model("User")
  return UserModel.findOne({ slackId: slackId }, (err, doc) => {
    if (err) {
      throw new Error("Error updating user")
    }
    doc.disqusUsername = disqusUsername
    doc.lastUpdate = Date.now()
    doc.save()
    return doc
  })
}

export default {
  updateUserData
}
