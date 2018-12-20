import AchievementController from "../controllers/achievement";

export const calculateAchievements = (user, interaction) => {

  let achievements = [];
  const userAchievements = user.achievements || [];

  if (hasAchievements(user) && hasAchievementsForCategoryAndAction(user, interaction)) {
    updateForCategoryAndAction();
    //TODO: buscar o atual
    //TODO: atualiza total
    //TODO: checar sem tem que atualizar o earnedDate
    //      Se ganhar conquista nova, adicionar XP
    //TODO: retorna achievement
    
      
  } else if (hasAchievements(user) && hasAchievementsForCategory(user, interaction)) {
    // TODO: Update quando existe categoria
  } else {
    const newAchievement = createAchievements(interaction);
    achievements = userAchievements.concat(newAchievement);
  }

  return achievements;
};

const hasAchievements = user => {
  return user.achievements && user.achievements.length > 0;
};

const hasAchievementsForCategory = () => {
  return user.achievements.find(achievement => achievement.name === interaction.category);
}

const updateAchievements = (user, interaction) => {

  // let achievements = user.achievements.find(achievement => {
  //   return (
  //     achievement.category === interaction.category &&
  //     achievement.action === interaction.action
  //   );
  // });

  let achievements = user.achievements.map(achievement => {
    // [bronze, prata]
    if (
      achievement.category === interaction.category &&
      achievement.action === interaction.action
    ) {

      achievements.total += 1;
    }

    return achievement;
  });

  console.log('achievements find', achievements);

  // achou bronze
  if(achievements) {
    console.log('achievements pre update', achievements);

    achievements.total += 1; // TODO: separar
    achievements.ratings = achievements.ratings.map(rating => {
      if(
        rating.earnedDate === null &&
        parseInt(rating.range, 10) === parseInt(achievements.total, 10)
      ){
        rating.earnedDate = Date.now();
      }

      return rating;
    });

    console.log('achievements pos update', achievements);
    
    // TODO: achar rating adequado
    // TODO: add total
    // TODO: substituir achievements
  } else {
    // TODO: se não achar
    console.log('Não achou achievement');
  }

  return user.achievements;
};

const hasAchievementsForCategoryAndAction = (user, interaction) => {
  return user.achievements.find(achievement => {
    return (
      achievement.name === interaction.category &&
      achievement.actions.find(action => action.name === interaction.action)
    );
  });
};

const updateForCategoryAndAction = () => {

};

const createAchievements = (interaction) => {

  const achievements = AchievementController.findMainByCategoryAndAction(
    interaction.category,
    interaction.action
  );

  let category = genareteNewCategory(interaction);
  let currentRating = 0;

  for (let item in achievements) {
    category.actions[0].ratings.push(
      generateNewRating(achievements, item)
    );

    for (let range in achievements[item].ranges) {
      category.actions[0].ratings[currentRating].ranges.push(
        generateNewRange(achievements, item, range)
      );
    }

    currentRating++;
  }
  
  category = addFirstNewEarnedDate(category);
  category = addFirstTotal(category);
 
  return [category];
};

const generateNewRange = (achievements, item, range) => {
  return {
    name: range,
    value: achievements[item].ranges[range],
    earnedDate: null
  }
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
    name: interaction.category,
    actions: [{
      name: interaction.action,
      total: 0,
      ratings: []
    }]
  };
};

const addFirstNewEarnedDate = category => {
  if(category.actions[0].ratings[0].ranges[0].value === 1) {
    category.actions[0].ratings[0].ranges[0].earnedDate = Date.now();
  }

  return category;
};

const addFirstTotal = category => {
  category.actions[0].total = 1;
  return category;
};
