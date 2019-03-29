import config from "config-yml";
import AchievementLevelModel from "../models/achievementLevel";
import { setRangesEarnedDates, isNewLevel } from "../utils/achievementsLevel";
import { getRecord } from "../utils/achievements";

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
  if (!userId) {
    console.log("Error user found on save achievement level");
  }

  const achievementExistent = await findByUser(userId);
  if (!achievementExistent) {
    try {
      return await createAchievement(userId, newLevel);
    } catch (error) {
      console.log("Error on create level achievement");
    }
  } else if (isNewLevel(currentLevel, newLevel)) {
    try {
      return await updateAchievement(achievementExistent, newLevel);
    } catch (error) {
      console.log("Error on update level achievement");
    }
  }
};

const createAchievement = async (userId, newLevel) => {
  const achievement = await generateNewAchievement(userId, newLevel);
  achievement.record = getRecord(achievement);
  return await achievement.save();
};

const updateAchievement = async (achievementExistent, newLevel) => {
  let achievement = setRangesEarnedDates(achievementExistent, newLevel);
  achievement.record = getRecord(achievement);
  return await achievement.save();
};

const generateNewAchievement = async (userId, newLevel) => {
  let achievement = new AchievementLevelModel();
  achievement.user = userId;
  achievement.ratings = generateRatings();

  achievement = setRangesEarnedDates(achievement, newLevel);
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
