import config from "config-yml";
import request from "make-requests";

export const sendHelloOnSlack = async userId => {
  const message =
    "Olá meu cavaleiro, você acabou de ganhar sua armadura de bronze para conseguir participar do nosso jogo!";
  let response = {};

  try {
    const url = `https://slack.com/api/chat.postEphemeral?token=${
      process.env.SLACK_TOKEN
    }&channel=${config.channels.valid_channels[0]}&text=${encodeURIComponent(
      message
    )}&user=${userId}&pretty=1`;

    response = await request(url, "POST");
  } catch (e) {
    response.error = e;
  }

  return response;
};
