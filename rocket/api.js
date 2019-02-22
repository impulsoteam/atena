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

runAPI();
