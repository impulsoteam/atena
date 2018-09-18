import config from "config-yml";
import express from "express";
import { getUserInfo, getChannelInfo, calculateScore } from "../utils";

import controller from "../controllers/interaction";
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
  let channel = await getChannelInfo(req.params.id);
  res.send({
    channel: channel && channel.channel
  });
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
  const interactions = await controller.findByUser(id);
  const user = await getUserInfo(id);

  let score = 0;

  interactions.forEach(interaction => {
    score = score + calculateScore(interaction);
  });

  if (req.query.format === "json") {
    res.send({
      user: user && user.profile,
      score
    });
  } else {
    res.render("profile", {
      title:
        "Perfil da pessoa jogadora, pra saber tudo de legal que fez pra ter 9.990 XP",
      data: {
        score
      }
    });
  }
});

router.get("/interactions/user/:id", async (req, res) => {
  const interactions = await controller.findByUser(req.params.id);
  const user = await getUserInfo(req.params.id);
  res.send({
    user: user && user.profile,
    interactions: interactions
  });
});

router.get("/game/rules", (req, res) => res.send(config.xprules));

export default router;
