import express from "express";
import { getUserInfo } from "../utils";
import { groupBy } from "../helpers/array";

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

router.get("/channel/:id", async (req, res) => {
  let interactions = [];
  try {
    interactions = await interactionController.findBy(req.params.id);
  } catch (err) {
    console.log(err);
  }

  res.send(groupBy(interactions, "user"));
});

router.get("/normalize", interactionController.normalizeScore);

router.get("/history", interactionController.history);
router.post("/mostactive", interactionController.engaged);

export default router;
