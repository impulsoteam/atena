import express from "express";
import config from "config-yml";
import bodyParser from "body-parser";
import queryString from "querystring";
import axios from "axios";
import userController from "../controllers/user";
import githubController from "../controllers/github";
import interactionController from "../controllers/interaction";
import { getStyleLog } from "../utils";
import { isValidRepository } from "../utils/github";
import { renderScreen } from "../utils/ssr";
const router = express.Router();

const link_auth = `https://github.com/login/oauth/authorize?scope=user:email&client_id=${
  process.env.GITHUB_CLIENT_ID
}`;
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/events", async (req, res) => {
  let data = req.body;
  let user = {};
  if (data.issue) data.type = "issue";
  if (data.review) data.type = "review";
  if (data.pull_request && data.action === "opened") data.type = "pull_request";
  if (data.pull_request && data.action === "closed")
    data.type = "merged_pull_request";
  const githubId =
    data.pull_request && data.pull_request.merged
      ? data.pull_request.user.id
      : data.sender.id;
  try {
    user = await userController.findByGithub({ githubId: githubId });
  } catch (e) {
    /* istanbul ignore next */
    // console.log("Github Events:", e);
  }
  data.user = user.slackId;
  const repository = req.body.repository.id.toString();
  if (
    isValidRepository(repository) &&
    !config.atenateam.members.includes(user.slackId)
  ) {
    if (data.type) {
      let valid = false;
      if (data.type === "issue" && data.action === "opened") valid = true;
      if (data.type === "review" && data.action === "submitted") valid = true;
      if (data.type === "pull_request" && data.action === "opened")
        valid = true;
      if (
        data.type === "merged_pull_request" &&
        data.action === "closed" &&
        data.pull_request.merged
      ) {
        valid = true;
      }
      if (valid) interactionController.save(data);
    } else {
      console.log(getStyleLog("yellow"), `\n-- event an type invalid`);
    }
  } else {
    console.log(
      getStyleLog("yellow"),
      `\n-- event into an invalid repository ${repository}`
    );
  }
  res.json(req.body);
});

router.get("/callback", async (req, res) => {
  let response;
  let user = {};
  let errors = [];
  const code = req.query.code;
  const slackId = req.query.state;
  try {
    user = await userController.find(slackId);
  } catch (e) {
    /* istanbul ignore next */
    errors.push(e);
  }
  const url = "https://github.com/login/oauth/access_token";
  let data = {};
  await axios
    .post(url, {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: code,
      accept: "json"
    })
    .then(res => {
      data = queryString.parse(res.data);
    })
    .catch(error => {
      errors.push(error);
      res.send(error);
    });

  if (data.access_token) {
    response = `Olá novamente, nobre Impulser! Sua dedicação foi posta a prova e você passou com honrarias!<br><br>
          A partir de agora você pode desempenhar trabalhos junto aos *nossos* projetos open-source!<br><br>
          Ainda está em dúvida de como funcionam?! Não tem problema, dá uma olhadinha aqui neste papiro: <a href="https://github.com/impulsonetwork/atena">https://github.com/impulsonetwork/atena</a>`;
    await axios
      .get("https://api.github.com/user", {
        params: {
          access_token: data.access_token
        }
      })
      .then(res_token => {
        const githubId = res_token.data.id;
        if (!user.githubId) {
          user = githubController.updateUserData(slackId, githubId);
        }
      })
      .catch(e => {
        errors.push(e);
      });
  } else if (data.error) {
    response = `Ops! parece que você entrou na caverna errada. Que falta faz um GPS, não é? Siga esse caminho e não vai errar: <a href="${link_auth}&state=${
      user.slackId
    }">${link_auth}&state=${user.slackId}</a> para tentar novamente.`;
  } else {
    response =
      "Não conseguimos localizar seu e-mail público ou privado na API do GITHUB, Seu esse recurso sua armadura de cavaleiro não está pronta para ganhar bonificações na contribuição do projeto Atena!";
  }

  const initialData = {
    title: "Batalha do Open Source | Impulso Network",
    response
  };

  renderScreen(req, res, "Github", initialData);
});

router.use("/", githubController.index);

router.use("/old", async (req, res) => {
  let user = {};
  let string;
  try {
    user = await userController.find(req.body.user_id);
  } catch (e) {
    /* istanbul ignore next */
    // console.log("Error: ", e);
  }
  if (!user.name) {
    const data = {
      channel: req.body.channel_id,
      text: "first on github messsage +1",
      ts: null,
      user: req.body.user_id
    };
    await interactionController.save(data);
    try {
      user = await userController.find(req.body.user_id);
    } catch (e) {
      /* istanbul ignore next */
      // console.log("Error: ", e);
    }
  }

  if (user.githubId) {
    string = `Olá! Leal, ${
      user.name
    }, você já pode participar dos meus trabalhos open-source! Go coding!`;
  }

  if (user.name && !user.githubId) {
    string = `Olá! Parece que você ainda não pertence as nossas fileiras, Impulser! Mas você não viria tão longe se não quisesse participar dos trabalhos com open-source, certo?!
Portanto, tens o que é preciso para estar entre nós, ${
      user.name
    }! Mas para participar dos trabalhos com open-source, preciso que vá até o seguinte local: ${link_auth}&state=${
      user.slackId
    }. Uma vez que conclua essa missão voltaremos a conversar!`;
  }
  res.send(string);
});

export default router;
