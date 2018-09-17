import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import querystring from "querystring";
import request from "async-request";
import { createEventAdapter } from "@slack/events-api";

import apiRoutes from "./routes";
import controller from "./controllers/interaction";
require("./models/interaction");

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

mongoose.connect(process.env.MONGODB_URI);
mongoose.set("useCreateIndexes", true);

const slackEvents = createEventAdapter(process.env.SLACK_SIGNIN_EVENTS);
const port = process.env.PORT;
const app = express();

app.set("view engine", "pug");
app.use(express.static("public"));
app.use("/", apiRoutes);

app.use((req, res, next) => {
  if (req.query.format === "json") {
    res.header("Content-Type", "application/json");
  }
  next();
});

const handleEvent = async e => {
  controller.save(e);
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
    dp: `/${e.type === "message" ? e.channel : e.item.channel}`,
    dt: `Slack Channel: ${e.type === "message" ? e.channel : e.item.channel}`,
    t: "event",
    ec: e.type === "message" ? e.channel : e.item.channel,
    ea: `${e.user}`,
    el: e.type === "message" ? `message: ${e.text}` : `reaction: ${e.reaction}`,
    ev: 1
  };
  const url = `https://www.google-analytics.com/collect?${querystring.stringify(
    params
  )}`;

  try {
    response = await request(url, { method: "POST" });
    console.log(response.body);
  } catch (e) {
    consol.log(e);
  }
};

app.use("/slack/events", slackEvents.expressMiddleware());

slackEvents.on("message", e => handleEvent(e));

slackEvents.on("reaction_added", e => handleEvent(e));

slackEvents.on("error", console.error);

app.listen(port, () => console.info(`Listening on port ${port}`));
