import config from "config-yml";
import express from "express";

const router = express.Router();

router.get("/rules", (req, res) => {
  res.send([config.xprules, config.levelrules, config.channels]);
});

export default router;
