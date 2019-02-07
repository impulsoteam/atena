import express from "express";
import UserController from "../controllers/user";
const router = express.Router();
import { isValidToken } from "../utils/teams";

router.get("/users", async (req, res) => {
  // const { team, token } = req.headers;
  let result = [];

  try {
    result = await UserController.findAll();
  } catch (e) {
    console.log(e);
  }

  // if (isValidToken(team, token)) {
  res.json(result);
  // } else {
  //   res.send(401);
  // }
});

export default router;
