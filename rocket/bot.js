import dotenv from "dotenv";
import { driver } from "@rocket.chat/sdk";

const runBot = async () => {
  const conn = await driver.connect({
    host: process.env.ROCKET_HOST,
    useSsl: process.env.NODE_ENV === "production" ? true : false
  });

  let myuserid = await driver.login({
    username: process.env.ROCKET_BOT_USER,
    password: process.env.ROCKET_BOT_PASS
  });

  const subscribed = await driver.subscribeToMessages();
  const msgloop = await driver.reactToMessages( processMessages );

};

const processMessages = async(err, message, messageOptions) => {
  if (!err) {
    console.log(message);
  } else {
    console.log(err);
  }
}

runBot();
