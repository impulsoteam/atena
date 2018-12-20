import AchievementController from "../controllers/achievement";

export const calculateAchievements = (user, interaction) => {
  let achievements = [];

  if (
    hasAchievements(user) &&
    hasAchievementsForCategoryAndAction(user, interaction)
  ) {
    achievements = updateForCategoryAndAction(user, interaction);
    console.log(achievements);

    //TODO: buscar o atual
    //TODO: atualiza total
    //TODO: checar sem tem que atualizar o earnedDate
    //      Se ganhar conquista nova, adicionar XP
    //TODO: retorna achievement
  } else if (
    hasAchievements(user) &&
    hasAchievementsForCategory(user, interaction)
  ) {
    // TODO: Update quando existe categoria
  } else {
    const userAchievements = user.achievements || [];
    const newAchievement = createAchievements(interaction);
    achievements = {
      score: newAchievement.score,
      items: userAchievements.concat(newAchievement.achievements)
    };
  }

  return achievements;
};

const hasAchievements = user => {
  return user.achievements && user.achievements.length > 0;
};

const hasAchievementsForCategory = (user, interaction) => {
  return user.achievements.find(
    achievement => achievement.category === interaction.category
  );
};

const hasAchievementsForCategoryAndAction = (user, interaction) => {
  return user.achievements.some(achievement => {
    return (
      achievement.category === interaction.category &&
      achievement.actions.some(action => action.name === interaction.action)
    );
  });
};

const updateForCategoryAndAction = (user, interaction) => {
  let xpToIncrease = 0;

  let achievements = user.achievements.map(achievement => {
    if (achievement.category === interaction.category) {
      achievement.actions = achievement.actions.map(action => {
        if (action.name === interaction.action) {
          action.total += 1;
          action.ratings.map(rating => {
            rating.ranges.map((range, index) => {
              if (range.earnedDate === null && range.value === action.total) {
                range.earnedDate = Date.now();
                if (rating.ranges.length == index + 1) xpToIncrease = rating.xp;
              }

              return range;
            });
            return rating;
          });
        }
        return action;
      });
    }

    return achievement;
  });

  return {
    score: xpToIncrease,
    items: achievements
  };
};

const createAchievements = interaction => {
  const achievements = AchievementController.findMainByCategoryAndAction(
    interaction.category,
    interaction.action
  );

  let category = genareteNewCategory(interaction);
  let currentRating = 0;

  for (let item in achievements) {
    category.actions[0].ratings.push(generateNewRating(achievements, item));

    for (let range in achievements[item].ranges) {
      category.actions[0].ratings[currentRating].ranges.push(
        generateNewRange(achievements, item, range)
      );
    }

    currentRating++;
  }

  category = addFirstNewEarnedDate(category);
  category = addFirstTotal(category);

  return {
    score: 0,
    achievements: category
  };
};

const generateNewRange = (achievements, item, range) => {
  return {
    name: range,
    value: achievements[item].ranges[range],
    earnedDate: null
  };
};

const generateNewRating = (achievements, item) => {
  return {
    name: achievements[item].name,
    xp: achievements[item].xp,
    ranges: []
  };
};

const genareteNewCategory = interaction => {
  return {
    category: interaction.category,
    actions: [
      {
        name: interaction.action,
        total: 0,
        ratings: []
      }
    ]
  };
};

const addFirstNewEarnedDate = category => {
  if (category.actions[0].ratings[0].ranges[0].value === 1) {
    category.actions[0].ratings[0].ranges[0].earnedDate = Date.now();
  }

  return category;
};

const addFirstTotal = category => {
  category.actions[0].total = 1;
  return category;
};
