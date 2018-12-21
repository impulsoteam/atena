import express from "express";
import bodyParser from "body-parser";
const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/events", async (req, res) => {
  res.json(req.body);
});

router.get("/callback", async (req, res) => {
  console.log(req.query, req.body);

  res.send("callback");
});

export default router;
