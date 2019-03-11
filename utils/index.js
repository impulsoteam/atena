import config from "config-yml";
import dotenv from "dotenv";
import axios from "axios";
import { calculateReceivedScore as calc } from "./calculateReceivedScore";
import { calculateReactions as calcReactions } from "./calculateReactions";
import { calculateAchievementsPosition as calcAchievements } from "./calculateAchievementsPosition";
import userController from "../controllers/user";
import { sendCollect, sendBotCollect } from "./analytics";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const slackToken = process.env.SLACK_TOKEN;

export const getUserInfo = async id => {
  const url = `https://slack.com/api/users.profile.get?token=${slackToken}&user=${id}`;
  let response = {};
  try {
    response = await axios(url);
  } catch (e) {
    console.log(
      getStyleLog("red"),
      "Error: https://api.slack.com/apps/{your-app}/oauth?",
      e
    );
  }

  return response;
};

export const getChannelInfo = async id => {
  const url = `https://slack.com/api/channels.info?token=${slackToken}&channel=${id}`;
  let response = {};

  try {
    response = await axios(url);
  } catch (e) {
    console.log(
      getStyleLog("red"),
      "Error: https://api.slack.com/apps/{your-app}/oauth?",
      e
    );
  }

  return response;
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
  } else if (interaction.type === "manual") {
    score = interaction.value;
  } else if (interaction.type === "inactivity") {
    score = config.xprules.inactive.value;
  } else if (interaction.type === "issue") {
    score = config.xprules.github.issue;
  } else if (interaction.type === "review") {
    score = config.xprules.github.review;
  } else if (interaction.type === "pull_request") {
    score = config.xprules.github.pull_request;
  } else if (interaction.type === "merged_pull_request") {
    score = config.xprules.github.merged_pull_request;
  } else if (interaction.type === "comment") {
    score = config.xprules.disqus.comment;
  }
  return score;
};

export const calculateReceivedScore = calc;

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

export const getRanking = async (req, isCoreTeamMember) => {
  let users = [];
  let myPosition = 0;
  let response = {
    text: "Veja as primeiras pessoas do ranking:",
    attachments: []
  };

  const user_id =
    req.headers.origin === "rocket" ? req.body.id : req.body.user_id;
  console.log("USER ID ", user_id);
  try {
    users = await userController.findAll(isCoreTeamMember, 5);
    myPosition = await userController.rankingPosition(
      user_id,
      isCoreTeamMember
    );
    response.text =
      users.length === 0 ? "Ops! Ainda ninguém pontuou. =/" : response.text;
    response.attachments = users.map((user, index) => ({
      text: `${index + 1}º lugar está ${
        user.slackId === user_id
          ? "você"
          : user.rocketId === user_id
          ? "você"
          : user.name
      } com ${user.score} XP, no nível ${user.level}`
    }));

    response.attachments.push({
      text: `Ah, e você está na posição ${myPosition} do ranking`
    });

    analyticsSendBotCollect(req.body);
  } catch (e) {
    // console.log("getRanking Error: ", e);
  }

  return response;
};

export const calculateReactions = calcReactions;

export const calculateAchievementsPosition = calcAchievements;
