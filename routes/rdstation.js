import express from "express";
import UserController from "../controllers/user";
const router = express.Router();

router.post("/users", async (req, res) => {
  let result = [];

  try {
    result = await UserController.findAll(false, -1, "-avatar -_id -email");
  } catch (e) {
    console.log(e);
  }

  res.json(result);
});

export default router;
