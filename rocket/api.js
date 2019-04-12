import { api } from "@rocket.chat/sdk";
import { getStyleLog } from "../utils";
import { getOr } from "lodash/fp";

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

const getUserInfo = async userId => {
  try {
    const result = await api.get("users.info", { userId: userId });
    return getOr(false, "user", result);
  } catch (e) {
    console.log(e);
    return false;
  }
};

const getUserInfoByUsername = async username => {
  try {
    const result = await api.get("users.info", { username: username });
    return getOr(false, "user", result);
  } catch (e) {
    console.log(e);
    return false;
  }
};

const getHistory = async roomId => {
  try {
    const result = await api.get("channels.history", {
      roomId: roomId,
      count: 8000
    });

    return result.messages;
  } catch (e) {
    console.log(e);
  }
  return false;
};

const getChannels = async () => {
  try {
    const result = await api.get("channels.list", { count: 400 });
    return result.channels;
  } catch (e) {
    console.log(e);
    return false;
  }
};

if (process.env.NODE_ENV !== "test") {
  runAPI();
}

const exportFunctions = {
  getUserInfo,
  getUserInfoByUsername,
  getHistory,
  getChannels
};

export default exportFunctions;
