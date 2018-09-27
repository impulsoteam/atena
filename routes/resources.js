import config from "config-yml";
import express from "express";

import userController from "../controllers/user";
const router = express.Router();

router.get("/normalize", async (req, res) => {
  const normalizeCoreTeam = await userController.checkCoreTeam();
  console.log(normalizeCoreTeam);
  res.send({ x: config.coreteam.members });
});

export default router;
