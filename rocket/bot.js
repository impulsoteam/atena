import { driver } from "@rocket.chat/sdk";
import interactionController from "../controllers/interaction";
// import fs from "fs";
// import path from "path";
// import mime from "mime-types";
// const emojiDir = './emoji';

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
  // const re = /!importemoji/g;
  const ranking = /!ranking/g;
  if (!err) {
    message.origin = "rocket";
    console.log("MESSAGE: ", message, messageOptions);
    if (message.u._id === myuserid) return;
    interactionController.save(message);

    if (ranking.test(message.msg)) {
      await driver.sendDirectToUser(
        "Em breve enviar o ranking",
        message.u.username
      );
    }
  } else {
    console.log(err, messageOptions);
  }
};

runBot();

/*
      const files = fs.readdirSync(emojiDir);

      for (const file of files) {
        const pathToFile = path.join(emojiDir, file);
        try {
          const stat = fs.statSync(pathToFile);
          if (stat.isFile()) {
            const mimeType = mime.lookup(pathToFile);
            var fileSplit = file.split(".");
            const emojiData = {
              name: fileSplit[0],
              aliases: "",
              newFile: true,
              extension: fileSplit[1]
            };

            await driver.callMethod("insertOrUpdateEmoji", emojiData);
            const fileData = fs.readFileSync(pathToFile);
            await driver.asyncCall("uploadEmojiCustom", [
              fileData,
              mimeType,
              emojiData
            ]);
            // delete fileData;
          }
        } catch (err) {
          console.log(err);
        }
      }
      */
