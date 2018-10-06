import cron from "node-cron";

export const checkUsersInactivity = async () => {
  cron.schedule("0 3 * * *", () => {
    // check users activity
  });
};
