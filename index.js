import autoprefixer from "autoprefixer";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import postcssMiddleware from "postcss-middleware";
import querystring from "querystring";
import request from "async-request";
import sassMiddleware from "node-sass-middleware";
import winston from "winston";
import { createEventAdapter } from "@slack/events-api";

import apiRoutes from "./routes";
import interactionController from "./controllers/interaction";
import { isValidChannel, getStyleLog } from "./utils";
require("./models/interaction");
require("./models/user");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: "error.log",
      level: "error"
    }),
    new winston.transports.File({
      filename: "combined.log"
    })
  ]
});

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  );
}

mongoose.connect(process.env.MONGODB_URI);
mongoose.set("useCreateIndexes", true);

const slackEvents = createEventAdapter(process.env.SLACK_SIGNIN_EVENTS);
const port = process.env.PORT;
const app = express();

app.set("view engine", "pug");
app.use(
  sassMiddleware({
    src: path.join(__dirname, "stylesheets"),
    dest: path.join(__dirname, "public"),
    debug: true,
    outputStyle: "compressed"
  })
);
app.use(
  postcssMiddleware({
    src: req => path.join("./", req.path),
    plugins: [
      autoprefixer({
        browsers: ["> 1%", "IE 7"],
        cascade: false
      })
    ]
  })
);
app.use(express.static("public"));
app.use("/", apiRoutes);

app.use((req, res, next) => {
  if (req.query.format === "json") {
    res.header("Content-Type", "application/json");
  }
  next();
});

const handleEvent = async e => {
  const channel = e.type === "message" ? e.channel : e.item.channel;
  if (isValidChannel(channel)) {
    interactionController.save(e);
    console.log(getStyleLog("blue"), "\nevent:", e);
  } else {
    console.log(getStyleLog("yellow"), "\n-- event into an invalid channel");
  }

  if (process.env.GA) {
    const params = {
      v: 1,
      tid: process.env.GA,
      cid: e.user,
      cd1: e.user,
      cd2: e.channel,
      cd3: e.thread_ts,
      cd4: e.type,
      ds: "slack",
      cs: "slack",
      dh: "https://impulsonetwork.slack.com",
      dp: `/${channel}`,
      dt: `Slack Channel: ${channel}`,
      t: "event",
      ec: channel,
      ea: `${e.user}`,
      el:
        e.type === "message" ? `message: ${e.text}` : `reaction: ${e.reaction}`,
      ev: 1
    };
    const url = `https://www.google-analytics.com/collect?${querystring.stringify(
      params
    )}`;

    try {
      const response = await request(url, { method: "POST" });
      console.log(response.body);
    } catch (e) {
      console.log(e);
    }
  } else {
    console.log(
      getStyleLog("yellow"),
      "\nSetup an instance of google analytics for tests\n"
    );
  }
};

app.use("/slack/events", slackEvents.expressMiddleware());

slackEvents.on("message", e => handleEvent(e));

slackEvents.on("reaction_added", e => handleEvent(e));

slackEvents.on("error", console.error);

app.listen(port, () => console.info(`Listening on port ${port}`));
