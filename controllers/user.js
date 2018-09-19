import mongoose from "mongoose";
import { calculateScore, calculateLevel, getUserInfo } from "../utils";
import { _throw } from "../helpers";

const update = async interaction => {
  const score = calculateScore(interaction);
  const userInfo = await getUserInfo(interaction.user);
  const UserModel = mongoose.model("User");
  const user = await UserModel.findOne({ slackId: interaction.user }).exec();

  if (user) {
    return UserModel.findOne({ slackId: interaction.user }, (err, doc) => {
      if (err) {
        throw new Error("Error updating user");
      }
      doc.level = calculateLevel(doc.score + score);
      doc.score = doc.score + score;
      doc.save();
      console.log("interaction", interaction);
      console.log("doc", doc);
      doc.messages =
        interaction.type === "message" ? doc.messages + 1 : doc.messages;
      doc.replies =
        interaction.type === "thread" ? doc.replies + 1 : doc.replies;
      doc.reactions =
        interaction.type === "reaction_added"
          ? doc.reactions + 1
          : doc.reactions;
      return doc;
    });
  } else {
    const obj = {
      avatar: userInfo.profile.image_72,
      name: userInfo.profile.real_name,
      level: 1,
      score: score,
      slackId: interaction.user,
      messages: interaction.type === "messages" ? 1 : 0,
      replies: interaction.type === "thread" ? 1 : 0,
      reactions: interaction.type === "reaction_added" ? 1 : 0,
      lastUpdate: new Date()
    };
    const instance = new UserModel(obj);
    return instance.save();
  }
};

const find = async user => {
  const UserModel = mongoose.model("User");
  const result = await UserModel.findOne({ slackId: user }).exec();

  return result || _throw("Error finding a specific user");
};

const findAll = async () => {
  const UserModel = mongoose.model("User");
  const result = await UserModel.find({}).exec();

  return result || _throw("Error finding all users");
};

export default {
  update,
  find
};
