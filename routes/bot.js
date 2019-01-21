import config from "config-yml";
import express from "express";
import request from "make-requests";
import bodyParser from "body-parser";
import { analyticsSendBotCollect, getRanking } from "../utils";
import userController from "../controllers/user";
import interactionController from "../controllers/interaction";
import achievementController from "../controllers/achievement";
import rankingController from "../controllers/ranking";
import { isCoreTeam, calculateAchievementsPosition } from "../utils";
import validSlackSecret from "../utils/validSecret";
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
    validSlackSecret(req, res);
  }
  try {
    user = await userController.findBy(query_user);
    myPosition = await userController.rankingPosition(user.id);
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

router.post("/ranking", rankingController.index);

router.get("/ranking-save", async (req, res) => {
  await rankingController.save();
  res.send("save");
});

router.post("/general-raking", urlencodedParser, async (req, res) => {
  // validSlackSecret(req, res);
  let response = {};

  try {
    response = await getRanking(req, isCoreTeam(req.body.user_id));
    analyticsSendBotCollect(req.body);
  } catch (e) {
    console.log(e);
  }

  console.log("RESPONSE", response);

  res.json(response);
});

router.post("/coreteamranking", urlencodedParser, async (req, res) => {
  validSlackSecret(req, res);
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
  let allAchievements = {};
  let user = {};
  let response = {
    text: "Ops! Você ainda não tem conquistas registradas. :("
  };

  validSlackSecret(req, res);

  try {
    user = await userController.find(req.body.user_id);
    allAchievements = await achievementController.findAllByUser(
      req.body.user_id
    );

    if (user && allAchievements.length > 0) {
      const achievements = calculateAchievementsPosition(allAchievements);
      if (achievements) {
        let textsAchievements = achievements.map(achievement => {
          return {
            text: `${achievement.name}: Você é ${achievement.rating.name} com ${
              achievement.total
            }/${achievement.rating.value}.`
          };
        });

        response = {
          text: `Olá ${user.name}, eis aqui as conquistas que solicitou:`,
          attachments: textsAchievements
        };
      }
    }
  } catch (e) {
    console.log("Bot -> Minhas Conquistas:", e);
  }

  res.json(response);
});

export default router;
