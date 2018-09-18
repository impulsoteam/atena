import path from "path";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import querystring from "querystring";
import request from "async-request";
import { createEventAdapter } from "@slack/events-api";
import sassMiddleware from "node-sass-middleware";

import apiRoutes from "./routes";
import controllers from "./controllers";
import { isValidChannel } from "./utils";
require("./models/interaction");
require("./models/user");

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
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
    controllers.interaction.save(e);
    console.log("event", e);
  } else {
    console.log("-- event into an invalid channel");
  }

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
    el: e.type === "message" ? `message: ${e.text}` : `reaction: ${e.reaction}`,
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
};

app.use("/slack/events", slackEvents.expressMiddleware());

slackEvents.on("message", e => handleEvent(e));

slackEvents.on("reaction_added", e => handleEvent(e));

slackEvents.on("error", console.error);

app.listen(port, () => console.info(`Listening on port ${port}`));
