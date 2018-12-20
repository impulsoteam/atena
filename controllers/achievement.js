import config from "config-yml";
import AchievementModel from "../models/achievement";
import { _throw } from "../helpers";

export const save = async interaction => {
  try {
    const achivementUser = await saveUserAchievement(interaction);
    console.log(achivementUser);
    // await saveParentUserAchievement(interaction);
  } catch (error) {
    console.log(error);
    _throw("Error saving achievement");
  }

  // TODO: save parentUser
};

const findMain = (category, action, type) => {
  let achievements = [];

  if (
    config.achievements.hasOwnProperty(category) &&
    config.achievements[category].hasOwnProperty(action) &&
    config.achievements[category][action].hasOwnProperty(type)
  ) {
    achievements = config.achievements[category][action][type];
  }

  return achievements || _throw("Error: finding main achievement");
};

const saveUserAchievement = async interaction => {
  // const UserModel = mongoose.model("User");
  // const user = await UserModel.findOne({
  //   slackId: interaction.user
  // }).exec();
  const query = {
    user: interaction.user,
    kind: `${interaction.category}.${interaction.action}.sended`
  };

  const achievement = await AchievementModel.findOne(query).exec();

  // user quem me enviou
  // parentUser quem recebeu

  if (achievement) {
    const newAchievement = updateRatings(achievement);

    if (newAchievement.score > 0) {
      // se tiver score > 0, atualizar user.score
    }

    return AchievementModel.update(query, {
      $set: {
        "ratings.$.ratings": newAchievement.ratings
      }
    });

    // achievement.ratings = [];
    // achievement.ratings.push(newAchievement.ratings);
    // return achievement.save();
  } else {
    const newAchievement = new AchievementModel(
      createAchievement(interaction, "sended")
    );
    return newAchievement.save();
  }
};

const updateRatings = achievement => {
  let xpToIncrease = 0;
  achievement.total += 1;

  let ratings = achievement.ratings.map(rating => {
    rating.ranges.map((range, index) => {
      if (range.earnedDate === null && range.value === achievement.total) {
        range.earnedDate = Date.now();
        if (rating.ranges.length == index + 1) xpToIncrease = rating.xp;
      }

      return generateDocWithoutId(range);
    });

    return generateDocWithoutId(rating);
  });
  return {
    score: xpToIncrease,
    ratings: ratings
  };
};

const generateDocWithoutId = doc => {
  let newDoc = {};

  for (let key in doc) {
    if (key !== "_id") newDoc[key] = doc[key];
  }

  return newDoc;
};

const createAchievement = (interaction, type) => {
  const achievements = findMain(interaction.category, interaction.action, type);

  let category = generateNewCategory(interaction, type);

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
  return category;
};

const generateNewCategory = (interaction, type) => {
  const category = config.categories[interaction.category];
  const action = config.actions[interaction.action];

  return {
    name: `${category.name} | ${action.name} ${action[type]}`,
    kind: `${category.type}.${action.type}.${type}`,
    user: type === "sended" ? interaction.user : interaction.parentUser,
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
  save
};
