import config from "config-yml";
import request from "make-requests";

export const sendHelloOnSlack = async userId => {
  const message =
    "Olá meu cavaleiro, você acabou de ganhar sua armadura de bronze para conseguir participar do nosso jogo!";
  let response = {};
  let channel;

  if (process.env.NODE_ENV !== "production") {
    channel = process.env.CHANNELS.split(" ")[0];
  } else {
    channel = config.channels.valid_channels[0];
  }

  try {
    const url = `https://slack.com/api/chat.postEphemeral?token=${
      process.env.SLACK_TOKEN
    }&channel=${channel}&text=${encodeURIComponent(
      message
    )}&user=${userId}&pretty=1`;

    response = await request(url, "POST");
  } catch (e) {
    response.error = e;
  }

  return response;
};
