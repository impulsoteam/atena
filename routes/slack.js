import express from "express";
import { createEventAdapter } from "@slack/events-api";
import interactionController from "../controllers/interaction";
import { getChannel } from "../utils/interactions";

import { isValidChannel, getStyleLog } from "../utils";
const router = express.Router();
const slackEvents = createEventAdapter(process.env.SLACK_SIGNIN_EVENTS);

router.use("/events", slackEvents.expressMiddleware());

const handleEvent = async e => {
  const channel = getChannel(e);

  if (isValidChannel(channel)) {
    if (e.type === "article") {
      e.origin = "blog";
    }
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
};

slackEvents.on("article", e => handleEvent(e));

slackEvents.on("message", e => handleEvent(e));

slackEvents.on("reaction_added", e => handleEvent(e));

slackEvents.on("reaction_removed", e => handleEvent(e));

slackEvents.on("error", console.error);

export default router;
