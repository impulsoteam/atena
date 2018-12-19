import mongoose from "mongoose";
import { _throw } from "../helpers";
import AchievementModel from "../models/achievement";

export const findAll = async () => {
  const AchievementModel = mongoose.model("Achievement");
  const result = await AchievementModel.find({});
  return result || _throw("Error finding achievements");
};

export const findById = async id => {
  const AchievementModel = mongoose.model("Achievement");
  const result = await AchievementModel.find({ _id: id });
  return result || _throw("Error finding achievement");
};

export const find = async query => {
  const AchievementModel = mongoose.model("Achievement");
  const result = await AchievementModel.find(query);
  return result || _throw("Error finding achievements");
};

export const findMainByCategoryAndAction = async (category, action) => {
  const AchievementModel = mongoose.model("Achievement");
  const result = await AchievementModel.find({
    category: category,
    actions: { 
      $all: [action]
    }
  })
  .limit(1);

  return result || _throw("Error finding main achievement");
};

const create = async obj => {
  const achievement = {
    name: obj.name,
    category: obj.category,
    actions: obj.actions,
    ratings: obj.ratings,
    xp: obj.xp,
    active: obj.active
  };
  const instance = new AchievementModel(achievement);
  return instance.save();
};

const update = async (id, obj) => {
  let achievement = await AchievementModel.findOne({ _id: id });

  //TODO: validar os antigos
  achievement.category = obj.category;
  achievement.actions = obj.actions;
  achievement.ratings = obj.ratings;
  achievement.xps = obj.xps;
  achievement.active = obj.active;

  return await achievement.save();
};

const remove = async id => {
  let achievement = await AchievementModel.findOne({ _id: id });

  if (achievement) {
    return await AchievementModel.deleteOne({ _id: id });
  } else {
    _throw("Error removing achievement");
  }
};

export default {
  findMainByCategoryAndAction,
  findAll,
  findById,
  find,
  create,
  update,
  remove
};
