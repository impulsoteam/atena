import config from "config-yml";
import express from "express";
import request from "async-request";
import bodyParser from "body-parser";
import { analyticsSendBotCollect } from "../utils";

import userController from "../controllers/user";
import rankingController from "../controllers/ranking";
import { getStyleLog, isCoreTeam } from "../utils";
const router = express.Router();

const urlencodedParser = bodyParser.urlencoded({ extended: true });

router.post("/score", urlencodedParser, async (req, res) => {
  let user = {};
  let myPosition = 0;
  let response = {
    text: "Ops! Você ainda não tem pontos registrados."
  };

  try {
    user = await userController.find(req.body.user_id);
    myPosition = await rankingController.rankingPosition(req.body.user_id);
    response = {
      text: `Olá ${user.name}, atualmente você está no nível ${
        user.level
      } com ${user.score} XP`,
      attachments: [
        {
          text: `Ah, e você está na posição ${myPosition} do raking`
        }
      ]
    };

    analyticsSendBotCollect(req.body);
  } catch (e) {
    console.log(e);
  }

  res.json(response);
});

router.post("/ranking", urlencodedParser, async (req, res) => {
  let users = [];
  let myPosition = 0;
  let response = {
    text: "Veja as primeiras pessoas do ranking:",
    attachments: []
  };

  try {
    users = await rankingController.findAll(5);
    myPosition = await rankingController.rankingPosition(req.body.user_id);
    response.text =
      users.length === 0 ? "Ops! Ainda ninguém pontuou. =/" : response.text;
    response.attachments = users.map((user, index) => ({
      text: `${index + 1}º lugar está ${
        user.slackId === req.body.user_id ? "você" : user.name
      } com ${user.score} XP, no nível ${user.level}`
    }));
    response.attachments.push({
      text: `Ah, e você está na posição ${myPosition} do raking`
    });

    analyticsSendBotCollect(req.body);
  } catch (e) {
    console.log(e);
  }

  res.json(response);
});

router.post("/coreteamranking", urlencodedParser, async (req, res) => {
  let users = [];
  let myPosition = 0;
  let response = {
    text: "Veja as primeiras pessoas do ranking do Core Team:",
    attachments: []
  };

  if (isCoreTeam(req.body.user_id)) {
    try {
      users = await rankingController.findAllCoreTeam(5);
      myPosition = await rankingController.rankingPosition(req.body.user_id);
      response.text =
        users.length === 0 ? "Ops! Ainda ninguém pontuou. =/" : response.text;
      response.attachments = users.map((user, index) => ({
        text: `${index + 1}º lugar está ${
          user.slackId === req.body.user_id ? "você" : user.name
        } com ${user.score} XP, no nível ${user.level}`
      }));
      response.attachments.push({
        text: `Ah, e você está na posição ${myPosition} do raking`
      });

      analyticsSendBotCollect(req.body);
    } catch (e) {
      console.log(e);
    }
  } else {
    response.text =
      "Você não faz parte do Core Team nem um cavaleiro de ouro, tente ver o seu ranking com o comando */ranking*";
  }

  res.json(response);
});

router.post("/feedback", urlencodedParser, async (req, res) => {
  let user = {};
  try {
    user = await userController.find(req.body.user_id);

    const url = `https://slack.com/api/chat.postEphemeral?token=${
      process.env.SLACK_TOKEN
    }&channel=${config.channels.valid_channels[0]}&text=${encodeURIComponent(
      `Tio, ${user.name} mandou um super feedback, saca só: _${req.body.text}_`
    )}&user=${process.env.SLACK_USER_FEEDBACK}&pretty=1`;

    const response = await request(url, { method: "POST" });
    console.log(response);
  } catch (e) {
    console.log(getStyleLog("red"), e);
  }

  res.json({
    text:
      "Super Obrigado pelo feedback, vou compartilhar isso com Seiya e os outros cavaleiros já! =D"
  });
});

export default router;
