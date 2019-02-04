import { driver } from "@rocket.chat/sdk";
import interactionController from "../controllers/interaction";

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

const processMessages = async (err, message, messageOptions) => {
  const ranking = /!ranking/g;
  if (!err) {
    message.origin = "rocket";
    console.log("MESSAGE: ", message, messageOptions);
    if (message.u._id === myuserid) return;
    interactionController.save(message);

    if (ranking.test(message.msg)) {
      await driver.sendDirectToUser(
        "Em breve você vai receber o Ranking",
        message.u.username
      );
    }
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

export const sendMessage = async message => {
  try {
    await driver.sendToRoom(message, "comunicados");
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

runBot();
