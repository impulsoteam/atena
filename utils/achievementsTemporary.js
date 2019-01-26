
export const createAchievements = async interaction => {
  const temporaryAchievementsData = await findMain(interaction);

  let temporaryAchievements = null;
  if (temporaryAchievementsData) {
    temporaryAchievements = convertToAchievementsTemporary(
      temporaryAchievementsData
    );
  }

  return temporaryAchievements;
};

const findMain = async interaction => {
  const query = getQueryToFindCurrent(interaction);
  const result = await TemporaryAchievementDataModel.find(query).exec();
  return result || _throw("Error finding a main temporary achievement");
};

const getQueryToFindCurrent = interaction => {
  const kind = getKind(interaction);
  return { kind: kind };
  // { initialDate: { $gt: new Date() } }
  // limitDate: { $lte: new Date().getTime() }
};

const getKind = interaction => {
  const type = getInteractionType(interaction);
  return `${interaction.category}.${interaction.action}.${type}`;
};
