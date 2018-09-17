import config from "config-yml";
import express from "express";
import { getUserInfo, getChannelInfo } from "../utils";

import controller from "../controllers/interaction";
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", {
    title: "Seja bem vindo! =D"
  });
});

router.get("/slack/user/:id", async (req, res) => {
  let user = await getUserInfo(req.params.id);
  res.send(user);
});

router.get("/slack/channel/:id", async (req, res) => {
  let channel = await getChannelInfo(req.params.id);
  res.send(channel);
});

router.get("/ranking", (req, res) => {
  const impulsers = [];

  if (req.query.format === "json") {
    res.send({
      data: impulsers
    });
  } else {
    res.render("ranking", {
      title: "Veja o Ranking do nosso game | Impulso Network",
      data: impulsers
    });
  }
});

router.get("/ranking/user/:id", async (req, res) => {
  const response = await controller.findByUser(req.params.id);
  res.send({
    status: 200,
    message: {
      xp: 200
    }
  });
});

router.get("/interactions/user/:id", async (req, res) => {
  const response = await controller.findByUser(req.params.id);
  res.send({
    status: 200,
    message: response
  });
});

router.get("/game/rules", (req, res) => res.send(config.xprules));

export default router;
