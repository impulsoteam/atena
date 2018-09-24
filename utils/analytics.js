import request from "async-request";
import querystring from "querystring";

import { getStyleLog } from "./index";

export const sendCollect = async e => {
  const channel = e.type === "message" ? e.channel : e.item.channel;

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
      return response;
    } catch (e) {
      console.log(getStyleLog("red"), e);
    }
  } else {
    console.log(
      getStyleLog("yellow"),
      "\nSetup an instance of google analytics for tests\n"
    );
  }
};
