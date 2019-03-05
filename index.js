import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import runCrons from "./cron";
import appRoutes from "./routes";
import compression from "compression";
import session from "express-session";
import passport from "passport";
import bodyParser from "body-parser";
require("./models/interaction");
require("./models/user");
require("./models/achievement");
require("./models/ranking");

if (process.env.NODE_ENV !== "test") {
  require("./rocket/bot");
  require("./rocket/api");
  require("./workers/receive");
}

runCrons();

process.env.NODE_ENV !== "production" && dotenv.config();

const mongooseConnectUri = process.env.MONGODB_URI;

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
app.use(session({ secret: "atenagamification" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use("/", appRoutes);

process.env.NODE_ENV !== "test" &&
  app.listen(port, () => console.info(`Listening on port ${port}`));

module.exports = app;
