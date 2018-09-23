import express from "express";

import userController from "../controllers/user";
const router = express.Router();

router.post("/ranking", async (req, res) => {
  let users = [];
  let rankingResponse = [];

  try {
    users = await userController.findAll(5);
    if (users.length > 0) {
      users.map((user, index) => {
        rankingResponse.push({
          text: `${index + 1}º lugar está ${user.name} com ${
            user.score
          } XP, no nível ${user.level}`
        });
      });
    }
  } catch (e) {
    console.log(e);
  }

  const response = {
    text: "Veja as primeiras pessoas do raking:",
    attachments: rankingResponse
  };

  res.json(response);
});

export default router;
