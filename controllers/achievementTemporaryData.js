import moment from "moment-timezone";
import TemporaryAchievementDataModel from "../models/achievementTemporaryData";
import {
  generateKind,
  generateRatingsRanges,
  generateDates
} from "../utils/achievementsTemporaryData";

export const save = async data => {
  try {
    const dates = generateDates(data);
    let obj = new TemporaryAchievementDataModel();
    obj.name = data.name;
    obj.kind = generateKind(data);
    obj.rangeTime = data.rangeTime;
    obj.initialDate = dates.initialDate;
    obj.limitDate = dates.limitDate;
    obj.endDate = dates.endDate;
    obj.ratings = generateRatingsRanges(data.ratings);

    return await obj.save();
  } catch (error) {
    console.log("Error saving temporary achievement data");
  }
};

export const update = async (data, id) => {
  try {
    let temporaryAchievementData = await TemporaryAchievementDataModel.findById(
      id
    ).exec();

    if (!temporaryAchievementData) {
      console.log(
        "Error not found temporaryAchievementData on update temporary achievement data"
      );
    }

    const dates = generateDates(data);
    temporaryAchievementData.name = data.name;
    temporaryAchievementData.initialDate = dates.initialDate;
    temporaryAchievementData.limitDate = dates.limitDate;
    temporaryAchievementData.endDate = dates.endDate;

    temporaryAchievementData.save();
  } catch (error) {
    console.log("Error update temporary achievement data");
  }
};

export const disable = async id => {
  try {
    let temporaryAchievementData = await TemporaryAchievementDataModel.findById(
      id
    ).exec();

    if (!temporaryAchievementData) {
      console.log(
        "Error not found temporaryAchievementData on update temporary achievement data"
      );
    }

    const today = moment(new Date())
      .utc()
      .endOf("day")
      .format();

    temporaryAchievementData.limitDate = today;
    temporaryAchievementData.endDate = today;

    temporaryAchievementData.save();
  } catch (error) {
    console.log("Error delete temporary achievement data");
  }
};

export const getById = async id => {
  try {
    const achivementTemporyData = await TemporaryAchievementDataModel.findById(
      id
    );
    return achivementTemporyData;
  } catch (error) {
    console.log("Error delete temporary achievement data");
  }
};

export const getAll = async () => {
  try {
    const achivementsTemporyData = await TemporaryAchievementDataModel.find();
    return achivementsTemporyData;
  } catch (error) {
    console.log("Error delete temporary achievement data");
  }
};

export default {
  save,
  update,
  disable,
  getById,
  getAll
};
