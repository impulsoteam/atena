import config from "config-yml";
import dotenv from "dotenv";
import request from "async-request";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const slackToken = process.env.SLACK_TOKEN;

export const getUserInfo = async id => {
  const url = `https://slack.com/api/users.profile.get?token=${slackToken}&user=${id}`;
  let response;
  try {
    response = await request(url);
  } catch (e) {
    console.log(e);
  }
  return response && JSON.parse(response.body);
};

export const getChannelInfo = async id => {
  const url = `https://slack.com/api/channels.info?token=${slackToken}&channel=${id}`;
  let response;

  try {
    response = await request(url);
  } catch (e) {
    console.log(e);
  }

  return response && JSON.parse(response.body);
};

export const calculateScore = (interaction, userId) => {
  let score = 0;
  if (interaction.user === userId) {
    if (interaction.type === "message") {
      score = config.xprules.messages.send;
    } else if (
      interaction.type === "reaction_added" &&
      interaction.parentUser !== userId
    ) {
      score = config.xprules.reactions.send;
    } else if (interaction.parentUser !== userId) {
      score = config.xprules.threads.send;
    }
  } else if (interaction.type === "thread") {
    score = config.xprules.threads.receive;
  } else if (
    interaction.description === "disappointed" ||
    interaction.description === "-1"
  ) {
    score = config.xprules.reactions.receive.negative;
  } else {
    score = config.xprules.reactions.receive.positive;
  }
  return score;
};

export const isValidChannel = channel => {
  const validChannels = config.channels.valid_channels;
  const isValid = validChannels.find(item => item === channel);

  return isValid ? true : false;
};
