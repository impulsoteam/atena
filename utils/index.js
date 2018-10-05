import config from "config-yml";
import dotenv from "dotenv";
import request from "async-request";

import { sendCollect, sendBotCollect } from "./analytics";
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
    console.log(
      getStyleLog("red"),
      "Error: https://api.slack.com/apps/{your-app}/oauth?",
      e
    );
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
    console.log(
      getStyleLog("red"),
      "Error: https://api.slack.com/apps/{your-app}/oauth?",
      e
    );
  }

  return response && JSON.parse(response.body);
};

export const calculateScore = interaction => {
  let score = 0;
  if (interaction.type === "message") {
    score = config.xprules.messages.send;
  } else if (
    interaction.type === "reaction_added" &&
    interaction.parentUser !== interaction.user
  ) {
    score = config.xprules.reactions.send;
  } else if (
    interaction.type === "reaction_removed" &&
    interaction.parentUser !== interaction.user
  ) {
    score = config.xprules.reactions.send * -1;
  } else if (
    interaction.type === "thread" &&
    interaction.parentUser !== interaction.user
  ) {
    score = config.xprules.threads.send;
  }
  return score;
};

export const calculateReceivedScore = interaction => {
  let score = 0;
  if (interaction.type === "reaction_added") {
    if (interaction.description === "+1") {
      score = config.xprules.reactions.receive.positive;
    } else if (interaction.description === "-1") {
      score = config.xprules.reactions.receive.negative;
    } else if (interaction.description === "atena") {
      score = config.xprules.reactions.atena;
    }
  } else if (interaction.type === "reaction_removed") {
    if (interaction.description === "+1") {
      score = config.xprules.reactions.receive.positive * -1;
    } else if (interaction.description === "-1") {
      score = config.xprules.reactions.receive.negative * -1;
    } else if (interaction.description === "atena") {
      score = config.xprules.reactions.atena * -1;
    }
  } else if (interaction.type === "thread") {
    score = config.xprules.threads.receive;
  }
  return score;
};

export const calculateLevel = score => {
  const level = config.levelrules.levels_range.findIndex(l => score < l) + 1;
  return level;
};

export const isValidChannel = channel => {
  let validChannels = [];
  if (process.env.NODE_ENV !== "production") {
    validChannels = process.env.CHANNELS.split(" ");
  } else {
    validChannels = config.channels.valid_channels;
  }
  const isValid = validChannels.find(item => item === channel);

  return !!isValid;
};

export const getStyleLog = style => {
  const styles = {
    black: "\x1b[30m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
    green: "\x1b[32m",
    magenta: "\x1b[35m",
    red: "\x1b[31m",
    white: "\x1b[37m",
    yellow: "\x1b[33m",
    reset: "\x1b[0m",
    reverse: "\x1b[7m",
    underscore: "\x1b[4m"
  };

  return `${styles[style]}%s${styles.reset}`;
};

export const analyticsSendCollect = e => {
  sendCollect(e);
};

export const analyticsSendBotCollect = e => {
  sendBotCollect(e);
};

export const isCoreTeam = userId => {
  const allCoreTeam = config.coreteam.members;

  return !!allCoreTeam.find(member => member === userId);
};

export const timeDifference = (first, last) => {
  const firstDate = new Date(first);
  const lastDate = new Date(last);
  const firstDateUTC = Date.UTC(
    firstDate.getFullYear(),
    firstDate.getMonth(),
    firstDate.getDate(),
    firstDate.getMinutes(),
    firstDate.getSeconds()
  );
  const lastDateUTC = Date.UTC(
    lastDate.getFullYear(),
    lastDate.getMonth(),
    lastDate.getDate(),
    lastDate.getMinutes(),
    lastDate.getSeconds()
  );

  const result = Math.floor(firstDateUTC - lastDateUTC) / 1000;

  return result;
};
