// import { _throw } from "../helpers";
import { sendToUser } from "../rocket/bot";
import { calculateAchievementsPosition } from "./calculateAchievementsPosition";
import { getLastAchievementRatingEarned } from "./achievements";

export const sendEarnedAchievementMessage = async (
  user,
  achievement,
  showLevel = false
) => {
  if (!user) {
    console.log("Error no user pass to send earned achievement messages");
  }

  if (!achievement) {
    console.log(
      "Error no achievement pass to send earned achievement messages"
    );
  }

  const name = achievement.name.split(" | ");
  const level = showLevel ? ` ${user.level}` : "";

  const privateMessage = `:medal: Você obteve a conquista [${
    achievement.rating
  } ${achievement.range} | ${name[1]}${level}]!`;

  // const publicMessage = `:medal: @${
  //   rocketUser.username
  // } obteve a conquista [${achievement.rating} ${achievement.range} | ${
  //   name[1]
  // }${level}]!`;

  await sendToUser(privateMessage, user.username);
  // await sendMessage(publicMessage, "impulso-network");
};

export const generateAchievementsMessages = achievements => {
  let messages = [];

  achievements = calculateAchievementsPosition(achievements);
  if (achievements.length) {
    achievements.map(achievement => {
      messages.push({
        text: `*${achievement.name}*:
        \n Você é ${achievement.rating.name} com ${achievement.total}/${
          achievement.rating.value
        }.`
      });
    });
  }

  return messages;
};

export const generateAchievementsTemporaryMessages = achievements => {
  let messages = [];

  achievements.map(achievement => {
    const currentAchievement = getLastAchievementRatingEarned(achievement);
    messages.push({
      text: `*${achievement.name}*:
      \n Você é ${currentAchievement.rating.name} ${
        currentAchievement.range.name
      } com total de ${currentAchievement.rating.total}.
      \n :trophy: Seu record é ${achievement.record.name} ${
        achievement.record.range
      } com total de ${achievement.record.total}.`
    });
  });

  return messages;
};

export const generateAchievementLevelMessage = achievement => {
  let messages = [];
  const lastRating = getLastAchievementRatingEarned(achievement);
  const recordRange = achievement.record.range
    ? ` ${achievement.record.range}`
    : "";

  messages.push({
    text: `*Network | Nível*:
    \n Você é ${lastRating.rating.name} ${lastRating.range.name} com nível ${
      lastRating.range.value
    }.
    \n :trophy: Seu record é ${
      achievement.record.name
    }${recordRange} com nível ${achievement.record.level}.`
  });

  return messages;
};
