import cron from "node-cron";

export default async () => {
  cron.schedule("0 3 * * *", async () => {});
};
