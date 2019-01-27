import TemporaryAchievementModel from "../models/achievementTemporary";
import TemporaryAchievementDataModel from "../models/achievementTemporaryData";
import UserModel from "../models/user";
import {
  addEarnedAchievement,
  getQueryToFindCurrent,
  getRecord,
  isBeforeLimitDate,
  isBeforeEndDate
} from "../utils/achievementsTemporary";
import { convertDataToAchievement } from "../utils/achievementsTemporaryData";
import { _throw } from "../helpers";

export const save = async interaction => {
  try {
    // TODO: find by channel
    const user = await UserModel.findOne({
      slackId: interaction.user
    }).exec();

    const query = getQueryToFindCurrent(interaction);
    let temporaryAchievementsData = await TemporaryAchievementDataModel.find(
      query
    ).exec();

    for (let temporaryAchievementData of temporaryAchievementsData) {
      let temporaryAchievementExistent = await TemporaryAchievementModel.findOne(
        {
          dataId: temporaryAchievementData._id,
          userId: user._id
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

      if (
        temporaryAchievementExistent &&
        isBeforeEndDate(temporaryAchievementExistent)
      ) {
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
      }
    }
  } catch (error) {
    _throw("Error saving temporary achievement");
  }
};

export default {
  save
};
