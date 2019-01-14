import cron from "node-cron";
import rankingController from "../controllers/ranking";

export default async () => {
  cron.schedule(
    "1 0 * * *",
    async () => {
      await rankingController.save();
    },
    null,
    true,
    "America/Sao_Paulo"
  );
};
