import cron from "node-cron";
import config from "config-yml";
import UserController from "../controllers/user";
import { getStyleLog } from "../utils";

export default async () => {
  cron.schedule("0 3 * * *", async () => {
    // let users;
    // try {
    //   users = await UserController.findInactivities();
    // } catch (e) {
    //   console.log(getStyleLog("red"), `\n-- error updating inactivity users`);
    //   return false;
    // }
    // users.forEach(user => {
    //   const score = config.xprules.inactive.value;
    //   const interaction = null;
    //   UserController.updateUserData(user, interaction, score);
    // });
    // return true;
  });
};
