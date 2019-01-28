import cron from "node-cron";
import AchievementsTemporaryController from "../controllers/achievementTemporary";
import { getStyleLog } from "../utils";
import { resetEarnedAchievements } from "../utils/achievementsTemporary";

export default async () => {
  cron.schedule("0 0 0 * * *", async () => {
    let achievements = [];

    try {
      achievements = await AchievementsTemporaryController.findInactivities();

      achievements.map(achievement => {
        let updatedAchievement = resetEarnedAchievements(achievement);
        updatedAchievement.save();
      });
    } catch (e) {
      console.log(
        getStyleLog("red"),
        `\n-- error updating inactivity temporary achievements`
      );
      return false;
    }

    return true;
  });
};
