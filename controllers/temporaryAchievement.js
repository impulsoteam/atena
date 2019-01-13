import TemporaryAchievementModel from "../models/temporaryAchievement";
import AchievementModel from "../models/achievement";
import { _throw } from "../helpers";

export const find = async userId => {
  const result = await TemporaryAchievementModel.find({
    user: userId
  }).exec();

  return result || _throw("Error finding a specific achievement");
};

export const save = async interaction => {
  try {
    await saveUserAchievement(interaction);
  } catch (error) {
    _throw("Error saving achievement");
  }
};

const saveUserAchievement = async interaction => {
  const query = getQuery(interaction);

  let achievement = await AchievementModel.findOne(query).exec();
  if (achievement) {
    return achievement.save();
  } else {
    achievement = createAchievement(interaction);
    if (achievement) {
      const newAchievement = new AchievementModel(achievement);
      return newAchievement.save();
    }
  }
};

const createAchievement = async interaction => {
  const temporaryAchievements = await findMain(interaction);
  let category = null;

  if (temporaryAchievements) {
    category = generateNewCategory(temporaryAchievements, interaction);
  }

  return category;
};

const generateNewCategory = (temporaryAchievements, interaction) => {

  return {
    name: temporaryAchievements.name,
    kind: temporaryAchievements.kind,
    rangeTime: temporaryAchievements.rangeTime,
    user: interaction.user,
    isPermanent: false,
    total: 1,
    ratings: [],
    record: {}
  };
};

const findMain = async interaction => {
  const query = getQuery(interaction);
  const result = await TemporaryAchievementModel.find(query).exec();

  return result || _throw("Error finding a specific achievement");
};

const getQuery = interaction => {
  return {
    user: interaction.user,
    kind: `${interaction.category}.${interaction.action}.${interaction.type}`,
    isPermanent: false
  };
};

export default {
  save
};
