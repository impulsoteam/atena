import { driver, api } from "@rocket.chat/sdk";
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
  const re = /!importemoji/g;
  if (!err) {
    message.origin = "rocket";
    console.log(message, messageOptions);
    // const url_user = `users.info`;
    // const user_info = await api.post(url_user, { userId: message.u._id });
    //
    if (message.u._id === myuserid) return;
    interactionController.save(message);
    if (re.test(message.msg)) {
      console.log("sending ranking to user?");
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
    }
    // const romname = await driver.getRoomName(message.rid);
    // await driver.sendToRoom("criou emoji?", romname);
  } else {
    console.log(err, messageOptions);
  }
};

export const sendToUser = async (message, user) => {
  await driver.sendDirectToUser(message, user);
}

runBot();
