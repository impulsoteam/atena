import express from "express";
import slackRoutes from "./slack";
import rocketRoutes from "./rocket";
import rankingRoutes from "./ranking";
import interactionsRoutes from "./interactions";
import gameRoutes from "./game";
import userRoutes from "./user";
import botRoutes from "./bot";
import githubRoutes from "./github";
import disqusRoutes from "./disqus";
import rdRoutes from "./rdstation";
import resourcesRoutes from "./resources";
import achievementsTemporyDataRoutes from "./achievementsTemporyData";
import minerRoutes from "./miner";
import { renderScreen } from "../utils/ssr";

const router = express.Router();
router.use("/slack", slackRoutes);
router.use("/rocket", rocketRoutes);
router.use("/ranking", rankingRoutes);
router.use("/interactions", interactionsRoutes);
router.use("/game", gameRoutes);
router.use("/user", userRoutes);
router.use("/bot/commands", botRoutes);
router.use("/resources", resourcesRoutes);
router.use("/integrations/github", githubRoutes);
router.use("/integrations/disqus", disqusRoutes);
router.use("/integrations/rd", rdRoutes);
router.use("/miner", minerRoutes);
router.use("/achievements/temporary/data", achievementsTemporyDataRoutes);

router.get("/", (req, res) =>
  renderScreen(res, "HowItWorks", {
    page: "index"
  })
);

export default router;
