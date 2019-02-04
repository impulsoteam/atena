import express from "express";
import UserController from "../controllers/user";
const router = express.Router();

router.put("/change-teams/:id", async (req, res) => {
  const { id } = req.params;
  const { teams } = req.body;
  let result = false;

  try {
    result = await UserController.changeTeams(id, teams);
  } catch (e) {
    console.log(e);
  }
  res.json(result);
});

export default router;
