import mongoose from "mongoose";

const updateUserData = (slackId, githubId) => {
  const UserModel = mongoose.model("User");
  return UserModel.findOne({ slackId: slackId }, (err, doc) => {
    if (err) {
      throw new Error("Error updating user");
    }
    doc.githubId = githubId;
    doc.lastUpdate = Date.now();
    doc.save();
    return doc;
  });
};

export default {
  updateUserData
};
