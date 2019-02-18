import express from "express";
import bodyParser from "body-parser";
import achievementTemporaryDataController from "../controllers/achievementTemporaryData";

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

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
