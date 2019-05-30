import cron from "node-cron";
import config from "config-yml";
import UserController from "../controllers/user";
import { getStyleLog } from "../utils";

export default async () => {
  cron.schedule("0 3 * * *", async () => {
    let users = [];
    try {
      users = await UserController.findInactivities();
    } catch (e) {
      console.log(getStyleLog("red"), `\n-- error updating inactivity users`);
      return false;
    }
    users.map(async user => {
      const newScore = config.xprules.inactive.value + user.score;

      user.level = UserController.calculateLevel(newScore);
      user.score = newScore;

      try {
        await user.save();
      } catch (error) {
        console.log(
          getStyleLog("red"),
          `\n-- error updating inactivity for this user ${user.name}`,
          error
        );
      }
    });

    return true;
  });
};
