import config from "config-yml";
import express from "express";
import request from "make-requests";
import bodyParser from "body-parser";
import { analyticsSendBotCollect, getRanking } from "../utils";
import userController from "../controllers/user";
import interactionController from "../controllers/interaction";
import achievementController from "../controllers/achievement";
import achievementTemporaryController from "../controllers/achievementTemporary";
import achievementLevelController from "../controllers/achievementLevel";
import rankingController from "../controllers/ranking";
import { isCoreTeam, calculateAchievementsPosition } from "../utils";
// import validSlackSecret from "../utils/validSecret";
import { sendMessage } from "../rocket/bot";
import { getLastRatingEarned } from "../utils/achievementsTemporary";
import { getLastRatingEarned as getLastRatingEarnedLevel } from "../utils/achievementsLevel";

const router = express.Router();

const urlencodedParser = bodyParser.urlencoded({ extended: true });
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/score", urlencodedParser, async (req, res) => {
  let user = {};
  let query_user;
  let myPosition = 0;
  let response = {
    text: "Ops! Você ainda não tem pontos registrados."
  };
  if (req.headers.origin === "rocket") {
    req.body.user_id = req.body.id;
    query_user = { rocketId: req.body.user_id };
  } else {
    query_user = { slackId: req.body.user_id };
    // validSlackSecret(req, res);
  }
  try {
    user = await userController.findBy(query_user);
    myPosition = await userController.rankingPosition(req.body.user_id);
    response = {
      text: `Olá ${user.name}, atualmente você está no nível ${
        user.level
      } com ${user.score} XP`,
      attachments: [
        {
          text: `Ah, e você está na posição ${myPosition} do ranking`
        }
      ]
    };
    analyticsSendBotCollect(req.body);
  } catch (e) {
    // console.log("Bot -> Score:", e);
  }

  res.json(response);
});

router.post("/ranking", rankingController.bot_index);

router.get("/ranking-save", async (req, res) => {
  await rankingController.save();
  res.send("save");
});

router.post("/general-raking", urlencodedParser, async (req, res) => {
  let response = {};

  try {
    response = await getRanking(req, isCoreTeam(req.body.user_id));
    analyticsSendBotCollect(req.body);
  } catch (e) {
    console.log(e);
  }
  res.json(response);
});

router.post("/coreteamranking", urlencodedParser, async (req, res) => {
  // validSlackSecret(req, res);
  let response = {};

  if (isCoreTeam(req.body.user_id)) {
    try {
      response = await getRanking(req, true);
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
  let response = {};
  try {
    user = await userController.find(req.body.user_id);

    const url = `https://slack.com/api/chat.postEphemeral?token=${
      process.env.SLACK_TOKEN
    }&channel=${config.channels.valid_channels[0]}&text=${encodeURIComponent(
      `Tio, ${user.name} mandou um super feedback, saca só: _${req.body.text}_`
    )}&user=${process.env.SLACK_USER_FEEDBACK}&pretty=1`;

    response = await request(url, "POST");
  } catch (e) {
    response.error = e;
  }

  res.json({
    text:
      "Super Obrigado pelo feedback, vou compartilhar isso com Seiya e os outros cavaleiros já! =D"
  });

  return response;
});

router.post("/sendpoints", urlencodedParser, async (req, res) => {
  let response = {
    text: "você tá tentando dar pontos prum coleguinha, né?!"
  };
  const value = +req.body.text.split("> ")[1];
  const userId = req.body.text
    .split("|")[0]
    .substring(2, req.body.text.split("|")[0].length);

  if (config.coreteam.admins.some(user => user === req.body.user_id)) {
    try {
      await interactionController.manualInteractions({
        type: "manual",
        user: userId,
        text: `você recebeu esses ${value || 0} pontos de ${req.body
          .user_name || "ninguém"}`,
        value: value
      });

      response.text = `você tá dando ${value || 0} pontos para ${userId ||
        "ninguém"}`;
    } catch (e) {
      response.text =
        "Ocorreu um erro nessa sua tentativa legal de dar pontos para outro coleguinha";
      console.log(e);
    }
  } else {
    response.text =
      "Nobre cavaleiro(a) da casa de bronze, infelizmente sua armadura não dá permissão para tal façanha =/";
  }

  res.json(response);
});

router.post("/minhasconquistas", urlencodedParser, async (req, res) => {
  // validSlackSecret(req, res);
  let response = { text: "Ops! Você ainda não tem conquistas registradas. :(" };

  try {
    let user = {};
    let attachments = [];
    let interaction = {};

    if (req.headers.origin === "rocket") {
      interaction = {
        origin: "rocket",
        user: req.body.id
      };
    } else {
      interaction = {
        origin: "slack",
        user: req.body.user_id
      };
    }

    user = await userController.findByOrigin(interaction);

    if (user) {
      let achievements = await achievementController.findAllByUser(user._id);

      if (achievements.length) {
        achievements = calculateAchievementsPosition(achievements);
        if (achievements.length) {
          achievements.map(achievement => {
            attachments.push({
              text: `${achievement.name}: Você é ${
                achievement.rating.name
              } com ${achievement.total}/${achievement.rating.value}.`
            });
          });
        }
      }

      let achievementsTemporary = await achievementTemporaryController.findAllByUser(
        user._id
      );

      if (achievementsTemporary.length) {
        achievementsTemporary.map(achievement => {
          const currentAchievement = getLastRatingEarned(achievement);
          attachments.push({
            text: `${achievement.name}: Você é ${
              currentAchievement.name
            } com total de ${
              currentAchievement.total
            }. | :trophy: Seu record é ${
              achievement.record.name
            } com total de ${achievement.record.total}.`
          });
        });
      }

      let achievementLevel = await achievementLevelController.findByUser(
        user._id
      );

      if (achievementLevel) {
        const lastRating = getLastRatingEarnedLevel(achievementLevel);
        attachments.push({
          text: `Network | Nível: Você é ${lastRating.rating.name} ${
            lastRating.range.name
          } com nível ${lastRating.range.value}. | :trophy: Seu record é ${
            achievementLevel.record.name
          } ${achievementLevel.record.range} com nível ${
            achievementLevel.record.level
          }.`
        });
      }

      if (attachments.length) {
        response = {
          text: `Olá ${user.name}, eis aqui as conquistas que solicitou:`,
          attachments: attachments
        };
      }
    }
  } catch (e) {
    console.log("Bot -> Minhas Conquistas:", e);
  }

  res.json(response);
});

router.post("/enviarcomoatena", urlencodedParser, req => {
  const message = req.body.text;

  if (
    config.coreteam.admins.some(user => user === req.body.user) &&
    message.length > 1
  ) {
    sendMessage(message);
  }
});

export default router;
