import { driver } from "@rocket.chat/sdk";
import interactionController from "../controllers/interaction";
import rankingController from "../controllers/ranking";

var myuserid;
const runBot = async () => {
  await driver.connect({
    host: process.env.ROCKET_HOST,
    useSsl: true
  });

  myuserid = await driver.login({
    username: process.env.ROCKET_BOT_USER,
    password: process.env.ROCKET_BOT_PASS
  });

  await driver.subscribeToMessages();
  await driver.reactToMessages(processMessages);
};

const commands = async message => {
  const rankingRegex = /!ranking/g;
  if (rankingRegex.test(message.msg)) {
    await rankingController.commandIndex(message);
  }
};

const processMessages = async (err, message, messageOptions) => {
  if (!err) {
    message.origin = "rocket";
    console.log("MESSAGE: ", message, messageOptions);
    if (message.u._id === myuserid) return;
    interactionController.save(message);
    await commands(message);
  } else {
    console.log(err, messageOptions);
  }
};

export const sendToUser = async (message, user) => {
  try {
    await driver.sendDirectToUser(message, user);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const sendMessage = async (message, room = "comunicados") => {
  try {
    await driver.sendToRoom(message, room);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

runBot();
