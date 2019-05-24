import { driver } from "@rocket.chat/sdk";
import interactionController from "../controllers/interaction";
import rankingController from "../controllers/ranking";
import userController from "../controllers/user";
import achievementController from "../controllers/achievement";

var myuserid;
const runBot = async () => {
  await driver.connect({
    host: process.env.ROCKET_HOST,
    useSsl:
      process.env.ROCKET_SSL === true || /true/i.test(process.env.ROCKET_SSL)
  });

  myuserid = await driver.login({
    username: process.env.ROCKET_BOT_USER,
    password: process.env.ROCKET_BOT_PASS
  });

  await driver.subscribeToMessages();
  await driver.reactToMessages(processMessages);
};

const commands = async message => {
  const regex = {
    ranking: /!ranking/g,
    rankingGeral: /!rankinggeral/g,
    meusPontos: /!meuspontos/g,
    minhasConquistas: /!minhasconquistas/g
  };

  if (regex.ranking.test(message.msg)) {
    await rankingController.commandIndex(message);
  } else if (regex.meusPontos.test(message.msg)) {
    await userController.commandScore(message);
  } else if (regex.rankingGeral.test(message.msg)) {
    await rankingController.commandGeneral(message);
  } else if (regex.minhasConquistas.test(message.msg)) {
    await achievementController.commandIndex(message);
  }

  return;
};

const processMessages = async (err, message, messageOptions) => {
  if (!err) {
    message.origin = "rocket";
    message.roomType = messageOptions.roomType;

    console.log("MESSAGE: ", message, messageOptions);
    if (message.u._id === myuserid || message.t) return;
    interactionController.save(message).catch(() => {
      console.log(
        "Erro ao salvar interação do usuário: id: ",
        message.u._id,
        " name: ",
        message.u.name,
        " em: ",
        new Date(message.ts["$date"]).toLocaleDateString("en-US")
      );
    });
    await commands(message);
  } else {
    console.log(err, messageOptions);
  }
};

export const sendToUser = async (message, user) => {
  try {
    console.log(message, user);
    await driver.sendDirectToUser(message, user);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const sendMessage = async (message, room = "comunicados") => {
  try {
    console.log(message, room);
    await driver.sendToRoom(message, room);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

runBot();
