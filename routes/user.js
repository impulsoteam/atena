import express from "express";
import bodyParser from "body-parser";
import userController from "../controllers/user";
const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.put("/change-teams/:id", async (req, res) => {
  const { id } = req.params;
  const { team } = req.body;
  let result = false;

  try {
    result = await userController.changeTeams(id, team);
  } catch (e) {
    console.log(e);
  }
  res.json(result);
});

router.get("/:id", userController.details);

export default router;
