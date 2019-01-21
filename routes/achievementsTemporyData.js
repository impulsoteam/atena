import express from "express";
import bodyParser from "body-parser";

import achievementTemporyDataController from "../controllers/achievementTemporaryData";

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/", async (req, res) => {
  let temporyAchievementsData = await achievementTemporyDataController.save(
    req.body
  );
  res.json(temporyAchievementsData);
});

router.put("/:id", async (req, res) => {
  let temporyAchievementsData = await achievementTemporyDataController.update(
    req.params.id,
    req.body
  );
  res.json(temporyAchievementsData);
});

router.delete("/:id", async (req, res) => {
  let temporyAchievementsData = await achievementTemporyDataController.exclude(
    req.params.id,
    req.body
  );
  res.json(temporyAchievementsData);
});

export default router;
