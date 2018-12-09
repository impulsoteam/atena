import config from "config-yml";
import mongoose from "mongoose";
import {
  calculateScore,
  calculateReceivedScore,
  calculateLevel,
  getUserInfo,
  isCoreTeam
} from "../utils";
import { sendHelloOnSlack } from "../utils/bot";
import { _throw } from "../helpers";

const updateParentUser = async interaction => {
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
          doc.lastUpdate = Date.now();
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

const update = async interaction => {
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
        const newScore = doc.score + score;
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
        doc.lastUpdate = Date.now();
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
      sendHelloOnSlack(obj.slackId);
      return instance.save();
    }
  } else {
    throw new Error(`Error: ${userInfo.error}`);
  }
};

const find = async (userId, isCoreTeam = false) => {
  const UserModel = mongoose.model("User");
  const result = await UserModel.findOne({
    slackId: userId,
    isCoreTeam: isCoreTeam
  }).exec();
  if (result) result.score = result.score.toFixed(0);

  return result || _throw("Error finding a specific user");
};

const findAll = async (isCoreTeam = false, limit = 20) => {
  const UserModel = mongoose.model("User");
  const result = await UserModel.find({
    score: { $gt: 0 },
    isCoreTeam: isCoreTeam
  })
    .sort({
      score: -1
    })
    .limit(limit)
    .exec();
  result.map(user => {
    user.score = parseInt(user.score);
  });

  return result || _throw("Error finding all users");
};

const rankingPosition = async (userId, isCoreTeam = false) => {
  const allUsers = await findAll(isCoreTeam);
  const position = allUsers.map(e => e.slackId).indexOf(userId) + 1;

  return position;
};

const checkCoreTeam = async () => {
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

const findInactivities = async () => {
  const UserModel = mongoose.model("User");
  const today = new Date();
  const dateRange = today.setDate(
    today.getDate() - config.xprules.inactive.mindays
  );
  const result = await UserModel.find({
    lastUpdate: { $lt: dateRange }
  })
    .sort({
      score: -1
    })
    .exec();

  return result || _throw("Error finding inactivity users");
};

export default {
  find,
  findAll,
  update,
  updateParentUser,
  rankingPosition,
  checkCoreTeam,
  findInactivities
};
