export const isPositiveReaction = interaction => {
  return interaction.description === "+1";
};

export const isNegativeReaction = interaction => {
  return interaction.description === "-1";
};

export const isAtenaReaction = interaction => {
  return interaction.description === "atena";
};
