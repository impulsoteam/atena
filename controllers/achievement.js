import config from "config-yml";
import { driver } from "@rocket.chat/sdk";
import AchievementModel from "../models/achievement";
import { isPositiveReaction, isAtenaReaction } from "../utils/reactions";
import {
  getInteractionType,
  calculateAchievementScoreToIncrease,
  getAchievementCurrentRating,
  getAchievementNextRating,
  saveScoreInteraction
} from "../utils/achievements";
import {
  generateAchievementsMessages,
  generateAchievementsTemporaryMessages,
  generateAchievementLevelMessage
} from "../utils/achievementsMessages";
import achievementTemporaryController from "../controllers/achievementTemporary";
import achievementLevelController from "../controllers/achievementLevel";
import { sendEarnedAchievementMessage } from "../utils/achievementsMessages";
import userController from "../controllers/user";

const commandIndex = async message => {
  let response = { text: "Ops! Você ainda não tem conquistas registradas. :(" };

  try {
    let user = {};
    let attachments = [];
    let interaction = {
      origin: "rocket",
      user: message.u._id
    };

    user = await userController.findByOrigin(interaction);

    if (user) {
      let achievements = await findAllByUser(user._id);

      if (achievements.length) {
        const achievementsMessages = generateAchievementsMessages(achievements);
        attachments = attachments.concat(achievementsMessages);
      }

      let achievementsTemporary = await achievementTemporaryController.findAllByUser(
        user._id
      );

      if (achievementsTemporary.length) {
        const achievementsMessages = generateAchievementsTemporaryMessages(
          achievementsTemporary
        );
        attachments = attachments.concat(achievementsMessages);
      }

      let achievementLevel = await achievementLevelController.findByUser(
        user._id
      );

      if (achievementLevel) {
        const achievementMessage = generateAchievementLevelMessage(
          achievementLevel
        );
        attachments = attachments.concat(achievementMessage);
      }

      if (attachments.length) {
        response = {
          text: `Olá ${user.name}, eis aqui as conquistas que solicitou:`,
          attachments: attachments
        };
      }
    }

    await driver.sendDirectToUser(response, message.u.username);
  } catch (e) {
    console.log("Minhas Conquistas:", e);
  }
};

const findAllByUser = async userId => {
  const result = await AchievementModel.find({ user: userId }).exec();

  return result || console.log("Error finding a specific achievement");
  // return result || _throw("Error finding a specific achievement");
};

const save = async (interaction, user) => {
  try {
    if (isValidAction(interaction)) {
      const type = getInteractionType(interaction);
      await saveUserAchievement(type, interaction, user);

      if (interaction.parentUser) {
        const parentUser = await userController.findByOrigin(interaction, true);
        await saveUserAchievement("received", interaction, parentUser);
      }
    }
  } catch (error) {
    console.log("Error achievement ", error);
    // _throw("Error saving achievement");
  }
};

const isValidAction = interaction => {
  return (
    interaction.parentUser !== interaction.user && isValidReaction(interaction)
  );
};

const isValidReaction = interaction => {
  if (
    interaction.action === config.actions.reaction.type &&
    (!isPositiveReaction(interaction) && !isAtenaReaction(interaction))
  ) {
    return false;
  }

  return true;
};

const findMain = (category, action, type) => {
  let achievements = null;
  if (
    config.hasOwnProperty(`achievements-${category}`) &&
    config[`achievements-${category}`].hasOwnProperty(action) &&
    config[`achievements-${category}`][action].hasOwnProperty(type)
  ) {
    achievements = config[`achievements-${category}`][action][type];
  }

  return achievements;
};

const saveUserAchievement = async (type, interaction, user) => {
  const query = {
    user: user._id,
    kind: `${interaction.category}.${interaction.action}.${type}`
  };

  let achievement = await AchievementModel.findOne(query).exec();
  if (achievement) {
    achievement.total += 1;
    achievement.ratings = updateRangeEarnedDate(achievement);
    await addScore(user, achievement);
    return achievement.save();
  } else {
    achievement = createAchievement(interaction, type, user);
    if (achievement) {
      const newAchievement = new AchievementModel(achievement);
      return newAchievement.save();
    }
  }
};

const addScore = async (user, achievement) => {
  const score = calculateAchievementScoreToIncrease(achievement);

  if (score > 0) {
    await userController.updateScore(user, score);
    await saveScoreInteraction(
      user,
      achievement,
      score,
      "Conquista Permanente"
    );
    await sendEarnedAchievementMessage(
      user,
      getAchievementNextRating(achievement)
    );
  }
};

const updateRangeEarnedDate = achievement => {
  return achievement.ratings.map(rating => {
    let ranges = rating.ranges.map(range => {
      if (!range.earnedDate && range.value === achievement.total) {
        range.earnedDate = Date.now();
      }

      return generateRange(range);
    });

    return generateRating(rating, ranges);
  });
};

const generateRating = (rating, ranges) => {
  return {
    name: rating.name,
    xp: rating.xp,
    ranges: ranges
  };
};

const generateRange = doc => {
  return {
    name: doc.name,
    value: doc.value,
    earnedDate: doc.earnedDate
  };
};

const createAchievement = (interaction, type, user) => {
  const achievements = findMain(interaction.category, interaction.action, type);
  let achievement = null;

  if (achievements) {
    achievement = generateNewAchievement(interaction, type, user);

    let currentRating = 0;
    for (let item in achievements) {
      achievement.ratings.push(generateNewRating(achievements, item));

      for (let range in achievements[item].ranges) {
        achievement.ratings[currentRating].ranges.push(
          generateNewRange(achievements, item, range)
        );
      }

      currentRating++;
    }

    achievement = addFirstNewEarnedDate(achievement);
    sendEarnedMessages(user, achievement);
  }

  return achievement;
};

const sendEarnedMessages = async (userId, achievement) => {
  const user = await userController.findBy({ _id: userId });
  await sendEarnedAchievementMessage(
    user,
    getAchievementCurrentRating(achievement)
  );
};

const generateNewAchievement = (interaction, type, user) => {
  const category = config.categories[interaction.category];
  const action = config.actions[interaction.action];

  return {
    name: `${category.name} | ${action.name} ${action[type]}`,
    kind: `${category.type}.${action.type}.${type}`,
    user: user._id,
    total: 1,
    ratings: []
  };
};

const generateNewRating = (achievements, item) => {
  return {
    name: achievements[item].name,
    xp: achievements[item].xp,
    ranges: []
  };
};

const generateNewRange = (achievements, item, range) => {
  return {
    name: range,
    value: achievements[item].ranges[range],
    earnedDate: null
  };
};

const addFirstNewEarnedDate = achievement => {
  if (achievement.ratings[0].ranges[0].value === 1) {
    achievement.ratings[0].ranges[0].earnedDate = Date.now();
  }

  return achievement;
};

export default {
  findAllByUser,
  save,
  commandIndex
};
