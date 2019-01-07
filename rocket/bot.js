import dotenv from "dotenv";
import { driver } from "@rocket.chat/sdk";

import interactionController from "../controllers/interaction";

const runBot = async () => {
  const conn = await driver.connect({
    host: process.env.ROCKET_HOST,
    useSsl: true
  });

  const myuserid = await driver.login({
    username: process.env.ROCKET_BOT_USER,
    password: process.env.ROCKET_BOT_PASS
  });

  const subscribed = await driver.subscribeToMessages();
  const msgloop = await driver.reactToMessages(processMessages);
};

const processMessages = async (err, message, messageOptions) => {
  if (!err) {
    message.origin = "rocket";
    interactionController.save(message);
  } else {
    console.log(err);
  }
};

runBot();
