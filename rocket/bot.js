import { driver } from "@rocket.chat/sdk";

import interactionController from "../controllers/interaction";

const runBot = async () => {
  await driver.connect({
    host: process.env.ROCKET_HOST,
    useSsl: true
  });

  await driver.login({
    username: process.env.ROCKET_BOT_USER,
    password: process.env.ROCKET_BOT_PASS
  });

  await driver.subscribeToMessages();
  await driver.reactToMessages(processMessages);
};

const processMessages = async (err, message, messageOptions) => {
  if (!err) {
    message.origin = "rocket";
    interactionController.save(message);
  } else {
    console.log(err, messageOptions);
  }
};

runBot();
