import express from "express";
import slackRoutes from "./slack";
import rocketRoutes from "./rocket";
import rankingRoutes from "./ranking";
import interactionsRoutes from "./interactions";
import gameRoutes from "./game";
import botRoutes from "./bot";
import githubRoutes from "./github";
import disqusRoutes from "./disqus";
import resourcesRoutes from "./resources";
import React from "react";
import ReactDOMServer from "react-dom/server";
import Html from "../client/Html";
import ScreenIndex from "../client/screens/Index";
const router = express.Router();
router.use("/slack", slackRoutes);
router.use("/rocket", rocketRoutes);
router.use("/ranking", rankingRoutes);
router.use("/interactions", interactionsRoutes);
router.use("/game", gameRoutes);
router.use("/bot/commands", botRoutes);
router.use("/resources", resourcesRoutes);
router.use("/integrations/github", githubRoutes);
router.use("/integrations/disqus", disqusRoutes);

router.get("/", (req, res) => {
  const initialData = {
    title: "Seja bem vindo! =D"
  };

  ReactDOMServer.renderToNodeStream(
    <Html initialData={JSON.stringify(initialData)}>
      <ScreenIndex {...initialData} name="Atena" />
    </Html>
  ).pipe(res);
});

export default router;
