import AchievementController from "../controllers/achievement";

export const calculateAchievements = async (user, interaction) => {
  console.log("Entrou em !calculateAchievements");
  if (hasActiveAchievements(user)) {
    console.log("Entrou em hasActiveAchievements");
    let achievements = getAchievement(user, interaction);
    //TODO: buscar o atual
    //TODO: atualiza total
    //TODO: checar sem tem que atualizar o earnedDate
    //      Se ganhar conquista nova, adicionar XP
    //TODO: retorna achievement
  } else {
    console.log("Entrou em !hasActiveAchievements");

    let achievement = await createAchievement(user, interaction);
    console.log("achievement", achievement);

    //TODO: cria achievement com total 1
    //TODO: atualizar achievement
  }

  return null;
};

const hasActiveAchievements = user => {
  return user.achievement && user.achievement.length > 0;
};

const getAchievement = (user, interaction) => {
  return {};
};

const createAchievement = async interaction => {
  //TODO: validar se tem achievements para aquela categoria e aquela ação o menor
  const achievement = await AchievementController.findMainByCategoryAndAction(
    interaction.category,
    interaction.action
  );
  return transformToUserAchievement(achievement);
};

const transformToUserAchievement = achievement => {
  console.log("achievement transform", achievement);

  let userAchievement = achievement;
  userAchievement.total = 1;

  delete userAchievement.__v;
  delete userAchievement.date;

  return userAchievement;
};
