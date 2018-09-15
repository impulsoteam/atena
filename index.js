import express from "express";
import { createEventAdapter } from "@slack/events-api";
import request from "async-request";
import querystring from "querystring";
const slackEvents = createEventAdapter("0e3a482607938ee3971006e0f9768554");
const port = process.env.PORT || 3000;
const slackToken = process.env.SLACK_TOKEN || "xoxp-271961991890-312238950902-435403620258-b07b50519e06e198d47d6feb92d1d5dd";
const app = express();

app.set('view engine', 'pug');
app.use(express.static('public'));

app.use((req, res, next) => {
  if (req.query.format === "json") {
    res.header("Content-Type", "application/json");
  }
  next();
});

app.get("/", (req, res) => {
  res.render("index", {
    title: "Seja bem vindo! =D"
  });
});

app.use("/slack/events", slackEvents.expressMiddleware());

let response;

const handleEvent = async e => {
  const params = {
    v: 1,
    tid: process.env.GA || "UA-101595764-2",
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
  const url = `https://www.google-analytics.com/collect?${querystring.stringify(params)}`;

  try {
    response = await request(url, { method: "POST" });
    console.log(response.body);
  } catch (e) {
    consol.log(e);
  };
};

const getUserInfo = async id => {
  const url = `https://slack.com/api/users.profile.get?token=${slackToken}&user=${id}`;

  try {
    response = await request(url);
  } catch (e) {
    consol.log(e);
  };
  return response;
};

const getChannelInfo = async id => {
  const url = `https://slack.com/api/channels.info?token=${slackToken}&channel=${id}`;

  try {
    response = await request(url);
  } catch (e) {
    consol.log(e);
  };
  return response.body;
};

slackEvents.on("message", e => handleEvent(e));

slackEvents.on("reaction_added", e => handleEvent(e));

slackEvents.on("error", console.error);

app.get("/slack/user/:id", async (req, res) => {
  let user = await getUserInfo(req.params.id);

  res.send(user);
});

app.get("/slack/channel/:id", async (req, res) => {
  let channel = await getChannelInfo(req.params.id);
  res.send(channel);
});

app.get("/ranking", (req, res) => {
  if (req.query.format === "json") {
    res.send({
      impulsers: []
    });
  } else {

    res.send("Hello World");
  }
});

app.listen(port, () => console.info(`Listening on port ${port}`));
