import express from "express";
import bodyParser from "body-parser";
import achievementTemporaryDataController from "../controllers/achievementTemporaryData";
import achievementController from "../controllers/achievement";
import userController from "../controllers/user";
import { getAchievementCurrentRating } from "../utils/achievements";
import InteractionModel from "../models/interaction";
import UserModel from "../models/user";
import UserLevelModel from "../models/userLevelHistory";
import AchievementModel from "../models/achievement";
import AchievementLevelModel from "../models/achievementLevel";
import AchievementTempModel from "../models/achievementTemporary";

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/user", async (req, res) => {
  const userId = "5c588bcda4b8ef757ddea242";
  const achievements = await achievementController.findAllByUser(userId);
  // const user = await userController.findBy({ _id: userId });
  // const messages = sendEarnedAchievementMessage(
  //   user,
  //   getLastRatingEarned(achievements[0])
  // );
  const achievement = getAchievementCurrentRating(achievements[0]);
  res.json(achievement);
});

router.get("/delete", async (req, res) => {
  await InteractionModel.remove({}).exec();
  await UserModel.remove({}).exec();
  await UserLevelModel.remove({}).exec();
  await AchievementModel.remove({}).exec();
  await AchievementLevelModel.remove({}).exec();
  await AchievementTempModel.remove({}).exec();
  res.json({ result: true });
});

router.get("/", async (req, res) => {
  let achievementsTemporaryData = await achievementTemporaryDataController.getAll();
  res.json(achievementsTemporaryData);
});

router.get("/:id", async (req, res) => {
  let achievementTemporaryData = await achievementTemporaryDataController.getById(
    req.params.id
  );
  res.json(achievementTemporaryData);
});

router.post("/", async (req, res) => {
  let achievementsTemporaryData = await achievementTemporaryDataController.save(
    req.body
  );
  res.json(achievementsTemporaryData);
});

router.put("/:id", async (req, res) => {
  let achievementTemporaryData = await achievementTemporaryDataController.update(
    req.params.id,
    req.body
  );
  res.json(achievementTemporaryData);
});

router.delete("/:id", async (req, res) => {
  let achievementTemporaryData = await achievementTemporaryDataController.disable(
    req.params.id
  );
  res.json(achievementTemporaryData);
});

export default router;
