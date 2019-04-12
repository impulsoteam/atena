import moment from "moment-timezone";

import achievementLevelController from "../controllers/achievementLevel";
import userLevelHistoryController from "../controllers/userLevelHistory";
import {
  getScoreToIncrease,
  getCurrentScoreToIncrease,
  getAchievementCurrentRating,
  getAchievementNextRating
} from "./achievements";
import { sendEarnedAchievementMessage } from "./achievementsMessages";

export const saveLevelHistoryChanges = async (userId, oldLevel, newLevel) => {
  await userLevelHistoryController.save(userId, oldLevel, newLevel);
};

export const sendLevelMessage = async (user, achievement, isUpdate) => {
  achievement.name = "Network | Nível";
  let rating = getAchievementCurrentRating(achievement);

  await sendEarnedAchievementMessage(user, rating, true);
};

export const saveAchivementLevelChanges = async (
  userId,
  oldLevel,
  newLevel
) => {
  return await achievementLevelController.save(userId, oldLevel, newLevel);
};

export const getLevelScore = achievement => {
  let score = 0;

  if (isNewAchievement(achievement)) {
    score = getScoreToIncrease(achievement);
  } else {
    score = getCurrentScoreToIncrease(achievement);
  }

  return score;
};

const isNewAchievement = achievement => {
  return moment(achievement.createdAt).isSame(moment(new Date()), "day");
};
