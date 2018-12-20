import config from "config-yml";
import mongoose from "mongoose";
import { _throw } from "../helpers";

export const find = async query => {
  const AchievementModel = mongoose.model("Achievement");
  const result = await AchievementModel.find(query);
  return result || _throw("Error finding achievements");
};

export const findMainByCategoryAndAction = (category, action) => {
  let achievements = [];

  if(
    config.achievements.hasOwnProperty(category) &&
    config.achievements[category].hasOwnProperty(action)
  ) {
    achievements = config.achievements[category][action];
  }

  return achievements || _throw("Error finding main achievement");
};

export default {
  findMainByCategoryAndAction,
  find
};
