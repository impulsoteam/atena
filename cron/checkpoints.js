import cron from "node-cron";
import interactionController from "../controllers/interaction";

export default async () => {
  cron.schedule(
    "5 0 * * mon",
    async () => {
      await interactionController.checkpoints();
    },
    null,
    true,
    "America/Sao_Paulo"
  );

  cron.schedule(
    "10 0 1 */3 *",
    async () => {
      await interactionController.checkpoints("quarter");
    },
    null,
    true,
    "America/Sao_Paulo"
  );
};
