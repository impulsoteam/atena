import express from "express";
import config from "config-yml";
import userController from "../controllers/user";
import rankingController from "../controllers/ranking";
const router = express.Router();

router.get("/", rankingController.index);
router.get("/mes/:month", rankingController.index);

//router.get("/", async (req, res) => {
//  console.log(req.params);
// search by ranking mensal
//  res.json({});
//});

router.get("/geral", async (req, res) => {
  // const { limit } = req.params;
  let users = [];

  try {
    users = await userController.findAll();
  } catch (e) {
    console.log(e);
  }

  if (req.query.format === "json") {
    res.json(users);
  } else {
    res.render("rankinggeral", {
      title: "Veja o Ranking do nosso game | Impulso Network",
      users
    });
  }
});

router.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  let user = {};

  try {
    user = await userController.find(id);
    user.next_level = config.levelrules.levels_range[user.level - 1];
  } catch (e) {
    console.log(e);
  }

  if (req.query.format === "json") {
    res.json(user);
  } else {
    res.render("profile", {
      title:
        "Perfil da pessoa jogadora, pra saber tudo de legal que fez pra ter 9.990 XP",
      user
    });
  }
});

export default router;
