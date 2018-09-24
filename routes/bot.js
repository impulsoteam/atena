import express from "express";

import userController from "../controllers/user";
const router = express.Router();

router.post("/score", async (req, res) => {
  let user = {};
  let response = {
    text: "você não tem pontos registrados ainda =/"
  };

  try {
    user = await userController.find(req.body.user_id);
    response = {
      text: `Olá ${user.name}, atualmente você está no nível ${
        user.level
      } com ${user.score} XP`
    };
  } catch (e) {
    console.log(e);
  }

  res.json(response);
});

router.post("/ranking", async (req, res) => {
  let users = [];
  let response = {
    text: "Veja as primeiras pessoas do raking:",
    attachments: []
  };

  try {
    users = await userController.findAll(5);
    response.attachments = users.map((user, index) => ({
      text: `${index + 1}º lugar está ${
        user.slackId === req.body.user_id ? "você" : user.name
      } com ${user.score} XP, no nível ${user.level}`
    }));
  } catch (e) {
    console.log(e);
  }

  res.json(response);
});

export default router;
