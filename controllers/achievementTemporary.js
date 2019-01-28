import moment from "moment-timezone";
import TemporaryAchievementModel from "../models/achievementTemporary";
import TemporaryAchievementDataModel from "../models/achievementTemporaryData";
import {
  addEarnedAchievement,
  getQueryToFindCurrent,
  getRecord,
  isBeforeLimitDate,
  isBeforeEndDate,
  resetEarnedAchievements
} from "../utils/achievementsTemporary";
import { convertDataToAchievement } from "../utils/achievementsTemporaryData";
import { _throw } from "../helpers";
import userController from "../controllers/user";

export const save = async interaction => {
  try {
    const user = await userController.findByOrigin(interaction);

    if (!user) {
      _throw("Error on find user to saving temporary achievement");
    }

    const query = getQueryToFindCurrent(interaction);
    let temporaryAchievementsData = await TemporaryAchievementDataModel.find(
      query
    ).exec();

    for (let temporaryAchievementData of temporaryAchievementsData) {
      let temporaryAchievementExistent = await TemporaryAchievementModel.findOne(
        {
          temporaryData: temporaryAchievementData._id,
          user: user._id
        }
      ).exec();

      if (
        !temporaryAchievementExistent &&
        isBeforeLimitDate(temporaryAchievementData)
      ) {
        let temporaryAchievement = convertDataToAchievement(
          temporaryAchievementData,
          user._id
        );

        temporaryAchievementExistent = await temporaryAchievement.save();
      }

      if (temporaryAchievementExistent) {
        if (isBeforeEndDate(temporaryAchievementData)) {
          let achievementToUpdate = addEarnedAchievement(
            temporaryAchievementExistent
          );

          let temporaryAchievement = achievementToUpdate.achievement;
          temporaryAchievement.record = getRecord(temporaryAchievement);
          await temporaryAchievement.save();

          if (achievementToUpdate.xpToIncrease) {
            user.score += achievementToUpdate.xpToIncrease;
            await user.save();
          }
        } else {
          let temporaryAchievement = resetEarnedAchievements(
            temporaryAchievementExistent
          );
          await temporaryAchievement.save();
        }
      }
    }
  } catch (error) {
    _throw("Error saving temporary achievement");
  }
};

export const findAllByUser = async userId => {
  return await TemporaryAchievementModel.find({
    user: userId
  })
    .populate({
      path: "temporaryData",
      match: { endDate: { $gte: moment(new Date()).format("YYYY-MM-DD") } }
    })
    .exec();
};

export const findInactivities = async () => {
  return await getAllInactivitiesDaily();
};

const getAllInactivitiesDaily = async () => {
  const achievements = await TemporaryAchievementModel.find({
    lastEarnedDate: {
      $gte: moment(new Date())
        .subtract(1, "days")
        .format("YYYY-MM-DD"),
      $lte: moment(new Date()).format("YYYY-MM-DD")
    }
  }).exec();

  return achievements;
};

export default {
  save,
  findInactivities,
  findAllByUser
};
