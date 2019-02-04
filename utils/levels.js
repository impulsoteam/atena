import achievementLevelController from "../controllers/achievementLevel";
import userLevelHistoryController from "../controllers/userLevelHistory";

export const doLevelChangeActions = async (userId, oldLevel, newLevel) => {
  await achievementLevelController.save(userId, oldLevel, newLevel);
  await userLevelHistoryController.save(userId, oldLevel, newLevel);
};
