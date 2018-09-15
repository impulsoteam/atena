import dotenv from "dotenv";
import express from "express";
import { createEventAdapter } from "@slack/events-api";
import request from "request";
import querystring from "querystring";

if (process.env.NODE_ENV !== "production") {
  dotenv.config()
}

const slackEvents = createEventAdapter(process.env.SLACK_SIGNIN_EVENTS);
const port = process.env.PORT;
const slackToken = process.env.SLACK_TOKEN;
const app = express();

app.use((req, res, next) => {
  res.header("Content-Type", "application/json");
  next();
});
app.get("/", (req, res) => res.send("i'm alive!"));
app.use("/slack/events", slackEvents.expressMiddleware());

const handleEvent = e => {
  console.log(e);
  let params = {
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
  request.post(
    `https://www.google-analytics.com/collect?${querystring.stringify(params)}`,
    (error, response, body) => {
      console.info(error);
    }
  );
};

const getUserInfo = id => {
  request.get(
    `https://slack.com/api/users.profile.get?token=${slackToken}&user=${id}`,
    (error, response, body) => {
      console.info(body);
      return body;
    }
  );
};

const getChannelInfo = id => {
  request.get(
    `https://slack.com/api/channels.info?token=${slackToken}&channel=${id}`,
    (error, response, body) => {
      console.info(body);
      return body;
    }
  );
};

slackEvents.on("message", e => handleEvent(e));

slackEvents.on("reaction_added", e => handleEvent(e));

slackEvents.on("error", console.error);

app.get("/slack/user/:id", (req, res) => {
  getUserInfo(req.params.id);
  res.send('done');
});

app.get("/slack/channel/:id", (req, res) => {
  getChannelInfo(req.params.id);
  res.send('done');
});

app.listen(port, () => console.info(`Listening on port ${port}`));
