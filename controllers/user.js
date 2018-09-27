import config from "config-yml";
import mongoose from "mongoose";
import {
  calculateScore,
  calculateReceivedScore,
  calculateLevel,
  getUserInfo,
  isCoreTeam
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
          const newScore = doc.score + score;
          doc.level = calculateLevel(newScore);
          doc.score = newScore < 0 ? 0 : newScore;
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

  // isCoreTeam(interaction.user);

  if (userInfo.ok) {
    const UserModel = mongoose.model("User");
    const user = await UserModel.findOne({ slackId: interaction.user }).exec();

    if (user) {
      return UserModel.findOne({ slackId: interaction.user }, (err, doc) => {
        if (err) {
          throw new Error("Error updating user");
        }
        const newScore = doc.score + score;
        // doc.isCoreTeam =
        doc.level = calculateLevel(newScore);
        doc.score = newScore < 0 ? 0 : newScore;
        doc.isCoreTeam = isCoreTeam(interaction.user);
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
        lastUpdate: new Date(),
        isCoreTeam: isCoreTeam(interaction.user)
      };
      const instance = new UserModel(obj);
      return instance.save();
    }
  } else {
    throw new Error(`Error: ${userInfo.error}`);
  }
};

export const find = async userId => {
  const UserModel = mongoose.model("User");
  const result = await UserModel.findOne({
    slackId: userId,
    isCoreTeam: false
  }).exec();

  return result || _throw("Error finding a specific user");
};

export const findAll = async limit => {
  const UserModel = mongoose.model("User");
  const result = await UserModel.find({
    score: { $gt: 0 },
    isCoreTeam: false
  })
    .sort({
      score: -1
    })
    .limit(limit || 15)
    .exec();

  return result || _throw("Error finding all users");
};

export const rankingPosition = async userId => {
  const allUsers = await findAll();
  const position = allUsers.map(e => e.slackId).indexOf(userId) + 1;

  return position;
};

export const checkCoreTeam = async () => {
  const UserModel = mongoose.model("User");
  const UsersBulk = UserModel.bulkWrite([
    {
      updateMany: {
        filter: { isCoreTeam: undefined },
        update: { isCoreTeam: false },
        upsert: { upsert: false }
      }
    },
    {
      updateMany: {
        filter: { slackId: { $in: config.coreteam.members } },
        update: { isCoreTeam: true },
        upsert: { upsert: false }
      }
    }
  ]);

  return UsersBulk;
};

export const findCoreTeam = async limit => {
  const UserModel = mongoose.model("User");
  const result = await UserModel.findAll({
    isCoreTeam: true
  })
    .sort({
      score: -1
    })
    .limit(limit || 15)
    .exec();

  return result || _throw("Error finding a specific user");
};

export default {
  find,
  findAll,
  update,
  updateParentUser,
  rankingPosition,
  checkCoreTeam,
  findCoreTeam
};
