import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import runCrons from "./cron";
import appRoutes from "./routes";
import compression from "compression";
require("./models/interaction");
require("./models/user");
require("./models/achievement");
require("./models/ranking");
require("./rocket/bot");

runCrons();

process.env.NODE_ENV !== "production" && dotenv.config();

const mongooseConnectUri =
  process.env.NODE_ENV === "test"
    ? process.env.MONGODB_TEST_URI
    : process.env.MONGODB_URI;

mongoose.connect(mongooseConnectUri);
mongoose.set("useCreateIndexes", true);

const port = process.env.PORT || 9001;
const app = express();

app.use(compression());

app.enable("trust proxy");

app.use((req, res, next) => {
  if (["production", "staging"].includes(process.env.NODE_ENV) && !req.secure) {
    res.redirect(`https://${req.headers.host}${req.url}`);
  } else {
    next();
  }
});

app.use(express.static("public"));
app.use("/", appRoutes);

process.env.NODE_ENV !== "test" &&
  app.listen(port, () => console.info(`Listening on port ${port}`));

module.exports = app;
