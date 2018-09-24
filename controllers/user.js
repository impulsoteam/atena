import mongoose from "mongoose";
import {
  calculateScore,
  calculateReceivedScore,
  calculateLevel,
  getUserInfo
} from "../utils";
import { _throw } from "../helpers";

export const updateParentUser = async interaction => {
  const score = calculateReceivedScore(interaction);
  const userInfo = await getUserInfo(interaction.parentUser);

  if (userInfo.ok) {
    const UserModel = mongoose.model("User");
    const user = await UserModel.findOne({
      slackId: interaction.parentUser
    }).exec();

    if (user) {
      return UserModel.findOne(
        { slackId: interaction.parentUser },
        (err, doc) => {
          if (err) {
            throw new Error("Error updating parentUser");
          }
          doc.level = calculateLevel(doc.score + score);
          doc.score = doc.score + score;
          doc.save();
          return doc;
        }
      );
    } else {
      throw new Error(`Error: parentUser does not exist `);
    }
  } else {
    throw new Error(`Error: ${userInfo.error}`);
  }
};

export const update = async interaction => {
  const score = calculateScore(interaction);
  const userInfo = await getUserInfo(interaction.user);

  if (userInfo.ok) {
    const UserModel = mongoose.model("User");
    const user = await UserModel.findOne({ slackId: interaction.user }).exec();

    if (user) {
      return UserModel.findOne({ slackId: interaction.user }, (err, doc) => {
        if (err) {
          throw new Error("Error updating user");
        }
        doc.level = calculateLevel(doc.score + score);
        doc.score = doc.score + score;
        doc.messages =
          interaction.type === "message" ? doc.messages + 1 : doc.messages;
        doc.replies =
          interaction.type === "thread" ? doc.replies + 1 : doc.replies;
        doc.reactions =
          interaction.type === "reaction_added"
            ? doc.reactions + 1
            : doc.reactions;
        doc.reactions =
          interaction.type === "reaction_removed"
            ? doc.reactions - 1
            : doc.reactions;
        doc.save();
        return doc;
      });
    } else {
      const obj = {
        avatar: userInfo.profile.image_72,
        name: userInfo.profile.real_name,
        level: 1,
        score: score,
        slackId: interaction.user,
        messages: interaction.type === "message" ? 1 : 0,
        replies: interaction.type === "thread" ? 1 : 0,
        reactions: interaction.type === "reaction_added" ? 1 : 0,
        lastUpdate: new Date()
      };
      const instance = new UserModel(obj);
      return instance.save();
    }
  } else {
    throw new Error(`Error: ${userInfo.error}`);
  }
};

export const find = async user => {
  const UserModel = mongoose.model("User");
  const result = await UserModel.findOne({ slackId: user }).exec();

  return result || _throw("Error finding a specific user");
};

export const findAll = async limit => {
  const UserModel = mongoose.model("User");
  const result = await UserModel.find({
    score: { $gt: 0 }
  })
    .sort({
      score: -1
    })
    .limit(limit || 15)
    .exec();

  return result || _throw("Error finding all users");
};

export default {
  find,
  findAll,
  update,
  updateParentUser
};
