import config from "config-yml";
import express from "express";
import { getUserInfo, getChannelInfo, isValidChannel } from "../utils";

import interactionController from "../controllers/interaction";
import userController from "../controllers/user";
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", {
    title: "Seja bem vindo! =D"
  });
});

router.get("/slack/events/", (req, res) => {
  res.send({
    token: "Jhj5dZrVaK7ZwHHjRyZWjbDl",
    challenge: "3eZbrw1aBm2rZgRNFdxV2595E9CY3gmdALWMmHkvFXO7tYXAYM8P",
    type: "url_verification"
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

router.get("/ranking", async (req, res) => {
  const { limit } = req.params;
  let users = [];

  try {
    users = await userController.findAll(limit);
  } catch (e) {
    console.log(e);
  }

  if (req.query.format === "json") {
    res.send({
      users
    });
  } else {
    res.render("ranking", {
      title: "Veja o Ranking do nosso game | Impulso Network",
      data: users
    });
  }
});

router.get("/ranking/user/:id", async (req, res) => {
  const { id } = req.params;
  let user = {};

  try {
    user = await userController.find(id);
  } catch (e) {
    console.log(e);
  }

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
