import express from "express";
import interactionController from "../controllers/interaction";
import UserController from "../controllers/user";
const router = express.Router();
import { isValidToken } from "../utils/teams";
import rankingController from "../controllers/ranking";

router.get("/ranking", async (req, res) => {
  const { team, token } = req.headers;
  let result = [];

  try {
    result = await UserController.findAll(false, null, "", team);
  } catch (e) {
    console.log(e);
  }

  if (isValidToken(team, token)) {
    res.json(result);
  } else {
    res.send(401);
  }
});

router.get("/ranking/mes/:month", rankingController.index);

router.get("/ranking/geral", rankingController.general);

router.get("/mostactive", interactionController.engaged);

export default router;
