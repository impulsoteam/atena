import { _throw } from "../helpers";
import TemporaryAchievementDataModel from "../models/achievementTemporaryData";
import { generateKind } from "../utils/achievementsTemporaryData";

export const save = async data => {
  try {
    let obj = new TemporaryAchievementDataModel();
    obj.name = data.name;
    obj.kind = generateKind(data);
    obj.rangeTime = data.rangeTime;
    obj.initialDate = new Date(data.initialDate);
    obj.limitDate = new Date(data.limitDate);
    obj.ratings = data.ratings;

    const achivementTemporyData = await obj.save();
    return achivementTemporyData;
  } catch (error) {
    _throw("Error saving temporary achievement data");
  }
};

export const update = data => {
  try {
    // TODO: create update
  } catch (error) {
    _throw("Error update temporary achievement data");
  }
};

export const exclude = data => {
  try {
    // TODO: create delete
  } catch (error) {
    _throw("Error delete temporary achievement data");
  }
};

export const getById = async id => {
  try {
    const achivementTemporyData = await TemporaryAchievementDataModel.findById(
      id
    );
    return achivementTemporyData;
  } catch (error) {
    _throw("Error delete temporary achievement data");
  }
};

export const getAll = async () => {
  try {
    const achivementsTemporyData = await TemporaryAchievementDataModel.find();
    return achivementsTemporyData;
  } catch (error) {
    _throw("Error delete temporary achievement data");
  }
};

export default {
  save,
  update,
  exclude,
  getById,
  getAll
};
