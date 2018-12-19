import express from "express";

import achievementController from "../controllers/achievement";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // const achievements = await achievementController.findAll();
    const achievements = await achievementController.findMainByCategoryAndAction(
      "Network",
      "Reply"
    );
    res.send(achievements);
  } catch (error) {
    //TODO: find error pattern
    res.send(error).status(500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const achievement = await achievementController.findById(req.params.id);
    res.send(achievement);
  } catch (error) {
    //TODO: find error pattern
    res.send(error).status(500);
  }
});

router.post("/", async (req, res) => {
  try {
    const achievement = await achievementController.create(req.body);
    res.send(achievement);
  } catch (error) {
    //TODO: find error pattern
    res.send(error).status(500);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const achievement = await achievementController.update(
      req.params.id,
      req.body
    );
    res.send(achievement);
  } catch (error) {
    //TODO: find error pattern
    res.send(error).status(500);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    //TODO: find pattern
    const achievement = await achievementController.remove(req.params.id);
    res.send(achievement);
  } catch (error) {
    //TODO: find error pattern
    res.send(error).status(500);
  }
});

export default router;
