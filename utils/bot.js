import config from "config-yml";
import request from "async-request";
import { getStyleLog } from "./index";

export const sendHelloOnSlack = async userId => {
  const message =
    "Olá meu cavaleiro, você acabou de ganhar sua armadura de bronze para conseguir participar do nosso jogo!";

  try {
    const url = `https://slack.com/api/chat.postEphemeral?token=${
      process.env.SLACK_TOKEN
    }&channel=${config.channels.valid_channels[0]}&text=${encodeURIComponent(
      message
    )}&user=${userId}&pretty=1`;

    const response = await request(url, { method: "POST" });
    console.log(response);
  } catch (e) {
    console.log(getStyleLog("red"), e);
  }

  return true;
};
