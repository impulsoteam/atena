export const isPositiveReaction = interaction => {
  return interaction.description === "+1"
    || interaction.description === ":thumbsup:";
};

export const isNegativeReaction = interaction => {
  return interaction.description === "-1"
    || interaction.description === ":thumbsdown:";
};

export const isAtenaReaction = interaction => {
  return interaction.description === "atena"
    || interaction.description === ":atena:";
};
