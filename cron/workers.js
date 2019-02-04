import cron from "node-cron";

export default () => {
  cron.schedule("0 1 * * *", () => {
    require("../workers/receive");
  });
};
