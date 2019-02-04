import config from "config-yml";

import userController from "./user";
import AchievementLevelModel from "../models/achievementLevel";
import { _throw } from "../helpers";
import { setRangesEarnedDates } from "../utils/achievementsLevel";
import {
  getAchievementCurrentRating,
  getRecord,
  getLastAchievementRatingEarned
} from "../utils/achievements";
import { sendEarnedAchievementMessage } from "../utils/achievementsMessages";

export const findAll = async () => {
  const achievementsLevel = await AchievementLevelModel.find()
    .populate("user")
    .exec();

  return achievementsLevel;
};

export const findByUser = async userId => {
  const achievementLevel = await AchievementLevelModel.findOne({
    user: userId
  }).exec();

  return achievementLevel;
};

export const save = async (userId, currentLevel, newLevel) => {
  const user = await userController.findBy({ _id: userId });

  if (!userId) {
    _throw("Error user found on save achievement level");
  }

  const achievementExistent = await findByUser(userId);
  console.log(
    "isNewLevel(currentLevel, newLevel)",
    isNewLevel(currentLevel, newLevel),
    currentLevel,
    newLevel
  );
  if (!achievementExistent) {
    try {
      return await createAchievement(user, newLevel);
    } catch (error) {
      _throw("Error on create level achievement");
    }
  } else if (isNewLevel(currentLevel, newLevel)) {
    try {
      await updateAchievement(achievementExistent, user, newLevel);
    } catch (error) {
      _throw("Error on update level achievement");
    }
  }
};

const isNewLevel = (currentLevel, newLevel) => {
  return parseInt(currentLevel, 10) !== parseInt(newLevel, 10);
};

const createAchievement = async (user, newLevel) => {
  const achievement = await generateNewAchievement(user._id, newLevel);
  await addNewScore(user, achievement);
  sendMessage(user, achievement);
  await achievement.save();
};

const updateAchievement = async (achievementExistent, user, newLevel) => {
  let achievement = setRangesEarnedDates(achievementExistent, newLevel);
  achievement.record = getRecord(achievement);
  await achievement.save();
  await addScore(user, achievement);
};

const sendMessage = async (user, achievement) => {
  achievement.name = "Network | Nível";
  await sendEarnedAchievementMessage(
    user,
    getAchievementCurrentRating(achievement)
  );
};

const addScore = async (user, achievement) => {
  const score = getCurrentScoreToIncrease(achievement);
  if (score > 0) {
    await sendMessage(user, achievement);
    await userController.updateScore(user, score);
  }
};

const addNewScore = async (user, achievement) => {
  const score = getAllScoreToIncrease(achievement);
  if (score > 0) {
    await userController.updateScore(user, score);
  }
};

const getCurrentScoreToIncrease = achievement => {
  let score = 0;
  const last = getLastAchievementRatingEarned(achievement);
  const range = last.rating.ranges.pop();

  if (range.earnedDate) {
    score = last.rating.xp;
  }

  return score;
};

const getAllScoreToIncrease = achievement => {
  let score = 0;

  achievement.ratings.map(rating => {
    let ranges = rating.ranges;
    let lastRange = ranges[ranges.length - 1];

    if (lastRange.earnedDate) {
      score += rating.xp;
    }
  });

  return score;
};

const generateNewAchievement = async (userId, newLevel) => {
  let achievement = new AchievementLevelModel();
  achievement.user = userId;
  achievement.ratings = generateRatings();

  achievement = setRangesEarnedDates(achievement, newLevel);
  achievement.record = getRecord(achievement);

  return achievement;
};

const generateRatings = () => {
  const achievementsLevel = config["achievements-network"].level;

  let ratings = [];
  for (let item in achievementsLevel) {
    const achievement = achievementsLevel[item];
    ratings.push({
      name: achievement.name,
      xp: achievement.xp,
      ranges: generateRanges(achievement.ranges)
    });
  }

  return ratings;
};

const generateRanges = ranges => {
  let newRanges = [];
  for (let item in ranges) {
    newRanges.push({
      name: item,
      value: ranges[item]
    });
  }

  return newRanges;
};

export default {
  save,
  findByUser,
  findAll
};
