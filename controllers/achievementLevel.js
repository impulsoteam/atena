import config from "config-yml";

import AchievementLevelModel from "../models/achievementLevel";
import { _throw } from "../helpers";
import { getRecord, setRangesEarnedDates } from "../utils/achievementsLevel";

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
    _throw("Error no user pass to find achievement level");
  }

  const achievementExistent = await findByUser(userId);

  if (!achievementExistent) {
    const achievement = await generateNewAchievement(userId, newLevel);
    await achievement.save();
  } else if (currentLevel != newLevel) {
    let achievement = setRangesEarnedDates(achievementExistent, newLevel);
    achievement.record = getRecord(achievement);
    await achievement.save();
  }
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
