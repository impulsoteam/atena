import express from "express";
import bodyParser from "body-parser";
import githubController from "../controllers/github";
const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.post("/events", githubController.events);
router.get("/callback", githubController.callback);
router.use("/", githubController.index);

export default router;
