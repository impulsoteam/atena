import config from "config-yml";
import AchievementModel from "../models/achievement";
import UserModel from "../models/user";
import { calculateLevel } from "../utils";
import { isPositiveReaction, isAtenaReaction } from "../utils/reactions";
import { _throw } from "../helpers";

export const findAllByUser = async userId => {
  const result = await AchievementModel.find({ user: userId }).exec();

  return result || _throw("Error finding a specific achievement");
};

export const save = async interaction => {
  try {
    if (isValidAction(interaction)) {
      const type = getInteractionType(interaction);
      await saveUserAchievement(interaction.user, type, interaction);

      if (interaction.parentUser) {
        await saveUserAchievement(
          interaction.parentUser,
          "received",
          interaction
        );
      }
    }
  } catch (error) {
    _throw("Error saving achievement");
  }
};

const getInteractionType = interaction => {
  let type = null;

  switch (interaction.type) {
    case "issue":
      type = "issue";
      break;
    case "review":
      type = "review";
      break;
    case "pull_request":
      type = "pull_request";
      break;
    case "merged_pull_request":
      type = "merged_pull_request";
      break;
    default:
      type = "sended";
      break;
  }

  return type;
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

const saveUserAchievement = async (user, type, interaction) => {
  const query = {
    user: user,
    kind: `${interaction.category}.${interaction.action}.${type}`
  };

  let achievement = await AchievementModel.findOne(query).exec();
  if (achievement) {
    const newAchievement = updateRatings(achievement);

    if (newAchievement.score > 0) {
      updateUserScore(user, newAchievement.score);
    }

    achievement.ratings = newAchievement.ratings;
    return achievement.save();
  } else {
    achievement = createAchievement(interaction, type, user);
    if (achievement) {
      const newAchievement = new AchievementModel(achievement);
      return newAchievement.save();
    }
  }
};

const updateUserScore = async (userId, achievementScore) => {
  const user = await UserModel.findOne({
    slackId: userId
  }).exec();

  if (user) {
    let newScore = user.score + achievementScore;
    user.level = calculateLevel(newScore);
    user.score = newScore;
    return user.save();
  }

  return;
};

const updateRatings = achievement => {
  let xpToIncrease = 0;
  achievement.total += 1;
  let ratings = achievement.ratings.map(rating => {
    let ranges = rating.ranges.map((range, index) => {
      if (range.earnedDate === null && range.value === achievement.total) {
        range.earnedDate = Date.now();
        if (rating.ranges.length == index + 1) xpToIncrease = rating.xp;
      }

      return generateRange(range);
    });
    return generateRating(rating, ranges);
  });
  return {
    score: xpToIncrease,
    ratings: ratings
  };
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
  let category = null;

  if (achievements) {
    category = generateNewCategory(interaction, type, user);

    let currentRating = 0;
    for (let item in achievements) {
      category.ratings.push(generateNewRating(achievements, item));

      for (let range in achievements[item].ranges) {
        category.ratings[currentRating].ranges.push(
          generateNewRange(achievements, item, range)
        );
      }

      currentRating++;
    }

    category = addFirstNewEarnedDate(category);
  }

  return category;
};

const generateNewCategory = (interaction, type, user) => {
  const category = config.categories[interaction.category];
  const action = config.actions[interaction.action];

  return {
    name: `${category.name} | ${action.name} ${action[type]}`,
    kind: `${category.type}.${action.type}.${type}`,
    user: user,
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

const addFirstNewEarnedDate = category => {
  if (category.ratings[0].ranges[0].value === 1) {
    category.ratings[0].ranges[0].earnedDate = Date.now();
  }

  return category;
};

export default {
  findAllByUser,
  save
};
