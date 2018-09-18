import config from "config-yml";
import express from "express";
import {
  getUserInfo,
  getChannelInfo,
  calculateScore,
  isValidChannel
} from "../utils";

import interactionController from "../controllers/interaction";
import userController from "../controllers/user";
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", {
    title: "Seja bem vindo! =D"
  });
});

router.get("/slack/user/:id", async (req, res) => {
  let user = await getUserInfo(req.params.id);
  res.send({
    user: user && user.profile
  });
});

router.get("/slack/channel/:id", async (req, res) => {
  let channel = req.params.id;
  if (isValidChannel(channel)) {
    channel = await getChannelInfo(channel);
    res.send({
      channel: channel && channel.channel
    });
  } else {
    res.send({
      ok: false,
      message: "Não estamos computando esse canal."
    });
  }
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
  const { id } = req.params;
  const user = await userController.find(id);

  if (req.query.format === "json") {
    res.send({
      user
    });
  } else {
    res.render("profile", {
      title:
        "Perfil da pessoa jogadora, pra saber tudo de legal que fez pra ter 9.990 XP",
      data: {
        score: user.score
      }
    });
  }
});

router.get("/interactions/user/:id", async (req, res) => {
  const interactions = await interactionController.findByUser(req.params.id);
  const user = await getUserInfo(req.params.id);
  res.send({
    user: user && user.profile,
    interactions: interactions
  });
});

router.get("/game/rules", (req, res) =>
  res.send([config.xprules, config.channels])
);

export default router;
