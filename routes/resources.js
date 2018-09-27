import config from "config-yml";
import express from "express";

import userController from "../controllers/user";
const router = express.Router();

router.get("/normalize", async (req, res) => {
  await userController.checkCoreTeam();
  res.send({ x: config.coreteam.members });
});

export default router;
