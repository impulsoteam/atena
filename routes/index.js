import express from "express";

import slackRoutes from "./slack";
import rankingRoutes from "./ranking";
import interactionsRoutes from "./interactions";
import gameRoutes from "./game";
const router = express.Router();

router.use("/slack", slackRoutes);
router.use("/ranking", rankingRoutes);
router.use("/interactions", interactionsRoutes);
router.use("/game", gameRoutes);

router.get("/", (req, res) => {
  res.render("index", {
    title: "Seja bem vindo! =D"
  });
});

export default router;
