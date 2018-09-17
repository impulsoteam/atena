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
