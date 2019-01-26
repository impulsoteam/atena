import TemporaryAchievementModel from "../models/achievementTemporary";
import { createAchievements } from "../utils/achievementsTemporary";
import { _throw } from "../helpers";

export const save = async interaction => {
  try {
    await saveUserAchievement(interaction);
  } catch (error) {
    console.log("error", error);
    _throw("Error saving temporary achievement");
  }
};

const saveUserAchievement = async interaction => {
  const query = getQueryToFindCurrent(interaction);
  let temporaryAchievementsExistents = await TemporaryAchievementModel.find(
    query
  ).exec();

  let temporaryAchievements = null;
  if (temporaryAchievementsExistents) {
    //TODO: update temporaryAchievements
    temporaryAchievements = temporaryAchievementsExistents; // TODO: validação do que sera atualizado
  } else {
    temporaryAchievements = await createAchievements(interaction);
  }

  try {
    for (const temporaryAchievement of temporaryAchievements) {
      await temporaryAchievement.save();
    }
  } catch (error) {
    _throw("Error saving achievement");
  }
};

export default {
  save
};
