import axios from "axios";
import querystring from "querystring";
import { getChannel } from "../utils/interactions";

import { getStyleLog } from "./index";

export const sendCollect = async e => {
  const channel = getChannel(e);

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
    let response = {};
    try {
      response = await axios.post(url);
    } catch (e) {
      console.log(getStyleLog("red"), e);
    }
    return response;
  } else {
    console.log(
      getStyleLog("yellow"),
      "\nSetup an instance of google analytics for tests\n"
    );
  }
};

export const sendBotCollect = async e => {
  if (process.env.GA) {
    const params = {
      v: 1,
      tid: process.env.GA,
      cid: e.user_id,
      cd1: e.user_id,
      cd2: e.channel_id,
      cd3: "",
      cd4: "command",
      ds: "slack",
      cs: "slack",
      dh: "https://impulsonetwork.slack.com",
      dp: `/${e.channel_id}`,
      dt: `Slack Channel: ${e.channel_id}`,
      t: "event",
      ec: e.channel_id,
      ea: `${e.user_id}`,
      el: `slash command: ${e.command}`,
      ev: 1
    };
    const url = `https://www.google-analytics.com/collect?${querystring.stringify(
      params
    )}`;
    let response = {};
    try {
      response = await axios.post(url);
    } catch (e) {
      console.log(getStyleLog("red"), e);
    }
    return response;
  } else {
    console.log(
      getStyleLog("yellow"),
      "\nSetup an instance of google analytics for tests\n"
    );
  }
};
