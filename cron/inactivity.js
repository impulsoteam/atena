import cron from "node-cron";
import UserController from "../controllers/user";
import InteractionController from "../controllers/interaction";
import { getStyleLog } from "../utils";

export default async () => {
  cron.schedule("0 3 * * *", async () => {
    let users = [];
    try {
      users = await UserController.findInactivities();

      users.map(user =>
        InteractionController.save({
          type: "inactivity",
          user: user.slackId
        })
      );
    } catch (e) {
      console.log(getStyleLog("red"), `\n-- error updating inactivity users`);

      return false;
    }
    return true;
  });
};
