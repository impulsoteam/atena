import express from "express";
import { createEventAdapter } from "@slack/events-api";

import interactionController from "../controllers/interaction";
import {
  getUserInfo,
  getChannelInfo,
  isValidChannel,
  getStyleLog,
  analyticsSendCollect
} from "../utils";
const router = express.Router();
const slackEvents = createEventAdapter(process.env.SLACK_SIGNIN_EVENTS);

router.use("/events", slackEvents.expressMiddleware());

const handleEvent = async e => {
  const channel = e.type === "message" ? e.channel : e.item.channel;

  if (isValidChannel(channel)) {
    e.type === "reaction_removed"
      ? interactionController.remove(e)
      : interactionController.save(e);
    console.log(getStyleLog("blue"), "\nevent:", e);
  } else {
    console.log(
      getStyleLog("yellow"),
      `\n-- event into an invalid channel ${channel}`
    );
  }

  analyticsSendCollect(e);
};

slackEvents.on("message", e => handleEvent(e));

slackEvents.on("reaction_added", e => handleEvent(e));

slackEvents.on("reaction_removed", e => handleEvent(e));

slackEvents.on("error", console.error);

router.get("/user/:id", async (req, res) => {
  let user = {};

  try {
    user = await await getUserInfo(req.params.id);
  } catch (e) {
    console.log(getStyleLog("red"), `\n-- ${e}`);
  }

  res.send({
    user: user && user.profile
  });
});

router.get("/channel/:id", async (req, res) => {
  let channel = req.params.id;
  if (isValidChannel(channel)) {
    channel = await getChannelInfo(channel);
    res.send({
      channel: channel && channel.channel
    });
  } else {
    res.send({
      ok: false,
      message: "Não estamos computando esse canal."
    });
  }
});

export default router;
