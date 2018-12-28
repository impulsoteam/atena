import express from "express";
import bodyParser from "body-parser";
import userController from "../controllers/user";
import interactionController from "../controllers/interaction";

const router = express.Router();

const link_auth = `https://disqus.com/api/oauth/2.0/authorize/?client_id=${
  process.env.DISQUS_PUBLIC_KEY
}&scope=email&response_type=code&redirect_uri=${
  process.env.DISQUS_CALLBACK_URL
}`;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/events", async (req, res) => {
  /* instanbul ignore next */
  res.json(req.body);
});

router.get("/callback", async (req, res) => {
  /* instanbul ignore next */
  console.log(req.query, req.body);

  res.send("callback");
});

export const getUser = async user_id => {
  let user = null;
  try {
    user = await userController.find(user_id);
  } catch (e) {
    /* instanbul ignore next */
  }
  return user;
};

router.use("/", async (req, res) => {
  let user = {};
  user = await getUser(req.body.user_id);
  if (!user) {
    const data = {
      channel: req.body.channel_id,
      text: "first on disqus integration +1",
      ts: null,
      user: req.body.user_id
    };
    await interactionController.save(data);
    user = await getUser(req.body.user_id);
  }
  let string = `Olá! Parece que você ainda não pertence as nossas fileiras, Impulser! Mas você não viria tão longe se não quisesse participar da discussão, certo?!
Portanto, tens o que é preciso para estar entre nós, ${user &&
    user.name}! Mas para participar dos trabalhos com open-source, preciso que vá até o seguinte local: ${link_auth}&state=${user &&
    user.slackId}. Uma vez que conclua essa missão voltaremos a conversar!`;

  res.send(string);
});

export default router;
