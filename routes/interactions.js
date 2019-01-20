import express from "express";
import { getUserInfo } from "../utils";

import interactionController from "../controllers/interaction";
const router = express.Router();

router.get("/user/:id", async (req, res) => {
  const interactions = await interactionController.find(req.params.id);
  const user = await getUserInfo(req.params.id);
  res.send({
    user: user && user.profile,
    interactions: interactions
  });
});

router.get("/normalize", interactionController.normalizeScore);

export default router;
