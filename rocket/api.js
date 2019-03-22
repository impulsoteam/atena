import { api } from "@rocket.chat/sdk";
import { getStyleLog } from "../utils";

var loginData;
const runAPI = async () => {
  if (loginData) return;

  try {
    loginData = await api.login({
      username: process.env.ROCKET_BOT_USER,
      password: process.env.ROCKET_BOT_PASS
    });
  } catch (error) {
    console.log(getStyleLog("red"), `\n-- [ROCKET API] Error on login`);
  }
};

export const getUserInfo = async userId => {
  try {
    const result = await api.get("users.info", { userId: userId });
    return result.user;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getUserInfoByUsername = async username => {
  console.log("try getUsernfoByUsername");
  try {
    const result = await api.get("users.info", { username: username });
    console.log("tem result? ", result);
    return result.user;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getHistory = async roomId => {
  try {
    const result = await api.get("channels.history", {
      roomId: roomId,
      count: 7500,
      oldest: "2019-02-06T00:00:00.304Z"
    });
    return result.messages;
  } catch (e) {
    console.log(e);
  }
  return false;
};

runAPI();
