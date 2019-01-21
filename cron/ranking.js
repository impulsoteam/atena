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

  cron.schedule(
    "* 9 * * mon",
    async () => {
      await rankingController.sendToChannel();
    },
    null,
    true,
    "America/Sao_Paulo"
  );

  cron.schedule(
    "55 23 30 4,6,9,11 *",
    async () => {
      await rankingController.sendToChannel();
    },
    null,
    true,
    "America/Sao_Paulo"
  );

  cron.schedule(
    "55 23 31 1,3,5,7,8,10,12 *",
    async () => {
      await rankingController.sendToChannel();
    },
    null,
    true,
    "America/Sao_Paulo"
  );

  cron.schedule(
    "55 23 28 2 *",
    async () => {
      await rankingController.sendToChannel();
    },
    null,
    true,
    "America/Sao_Paulo"
  );
};
