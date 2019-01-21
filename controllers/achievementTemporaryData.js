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

export default {
  save
};
