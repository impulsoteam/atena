import TemporaryAchievementModel from "../models/achievementTemporary";
import TemporaryAchievementDataModel from "../models/achievementTemporaryData";

import { _throw } from "../helpers";
import { getInteractionType } from "../utils/achievements";
import { convertToAchievementsTemporary } from "../utils/achievementsTemporaryData";

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

const createAchievements = async interaction => {
  const temporaryAchievementsData = await findMain(interaction);

  let temporaryAchievements = null;
  if (temporaryAchievementsData) {
    temporaryAchievements = convertToAchievementsTemporary(
      temporaryAchievementsData
    );
  }

  return temporaryAchievements;
};

const findMain = async interaction => {
  const query = getQueryToFindCurrent(interaction);
  const result = await TemporaryAchievementDataModel.find(query).exec();
  return result || _throw("Error finding a main temporary achievement");
};

const getQueryToFindCurrent = interaction => {
  const kind = getKind(interaction);
  return { kind: kind };
  // { initialDate: { $gt: new Date() } }
  // limitDate: { $lte: new Date().getTime() }
};

const getKind = interaction => {
  const type = getInteractionType(interaction);
  return `${interaction.category}.${interaction.action}.${type}`;
};

export default {
  save
};
