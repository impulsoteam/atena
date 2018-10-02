import config from "config-yml";
import mongoose from "mongoose";
import {
  calculateScore,
  calculateLevel,
  getUserInfo,
  getStyleLog,
  waitFor,
  asyncForEach,
  isCoreTeam
} from "../utils";
import { _throw, _today } from "../helpers";

const updateRanking = async (slackId, score, interactionType) => {
  const userInfo = await getUserInfo(slackId);

  if (userInfo.ok) {
    const rankingModel = mongoose.model("Ranking");
    const user = await rankingModel.findOne({ slackId }).exec();

    if (user) {
      return rankingModel.findOne({ slackId }, (err, doc) => {
        if (err) {
          throw new Error("Error updating ranking");
        }
        const newScore = doc.score + score;
        doc.level = calculateLevel(newScore);
        doc.score = newScore < 0 ? 0 : newScore;
        doc.isCoreTeam = isCoreTeam(slackId);
        doc.save();
        return doc;
      });
    } else {
      const obj = {
        avatar: userInfo.profile.image_72,
        name: userInfo.profile.real_name,
        level: 1,
        score: score,
        slackId,
        lastUpdate: new Date(),
        isCoreTeam: isCoreTeam(interactionType)
      };
      const instance = new rankingModel(obj);
      return instance.save();
    }
  } else {
    throw new Error(`${userInfo.error}`);
  }
};

const generateRanking = async () => {
  const interactionsModel = mongoose.model("Interaction");
  const users = await interactionsModel
    .aggregate([
      {
        $group: {
          _id: {
            user: "$user"
          }
        }
      }
    ])
    .exec();

  const todayLimitScore = config.xprules.limits.daily;

  users.forEach(async user => {
    const interactionsTodayByUser = await interactionsModel
      .find({
        $or: [{ user: user._id.user }, { parentUser: user._id.user }],
        date: {
          $gte: _today.start
        }
      })
      .exec();
    let scoreDay = 0;
    await asyncForEach(interactionsTodayByUser, async interaction => {
      await waitFor(50);
      scoreDay = scoreDay + calculateScore(interaction);
      if (scoreDay < todayLimitScore) {
        if (
          interaction.user === user._id.user ||
          (interaction.type !== "message" &&
            interaction.parentUser !== interaction.user)
        ) {
          const slackId =
            interaction.user === user._id.user
              ? user._id.user
              : interaction.parentUser;
          const interactionType =
            interaction.user === user._id.user ? interaction.type : "received";
          await updateRanking(
            slackId,
            calculateScore(interaction),
            interactionType
          );
        }
      }
    });
  });

  console.info(getStyleLog("green"), "Ranking updated!", new Date());

  return users;
};

const findAll = async limit => {
  const rankingModel = mongoose.model("Ranking");
  const result = await rankingModel
    .find({
      score: { $gt: 0 },
      isCoreTeam: false
    })
    .sort({
      score: -1
    })
    .limit(limit || 15)
    .exec();
  result.map(user => {
    user.score = parseInt(user.score);
  });

  return result || _throw("Error finding all users");
};

const rankingPosition = async userId => {
  const allUsers = await findAll();
  const position = allUsers.map(e => e.slackId).indexOf(userId) + 1;

  return position;
};

const findAllCoreTeam = async limit => {
  const rankingModel = mongoose.model("Ranking");
  const result = await rankingModel
    .findAll({
      score: { $gt: 0 },
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
  findAllCoreTeam,
  generateRanking,
  rankingPosition,
  findAll
};
