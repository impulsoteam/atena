export const isPositiveReaction = interaction => {
  return interaction.description === "+1";
};

export const isNegativeReaction = interaction => {
  return interaction.description === "-1";
};

export const isAtenaReaction = interaction => {
  return interaction.description === "atena";
};

export const calculateReactions = (interaction, reactions = {}) => {
  // FIXME: Remove after all users are updated
  reactions = convertToPositiveAndNegative(reactions);

  if (isPositiveReaction(interaction)) {
    reactions.positives = calculateNewReactionsValues(
      interaction.type,
      reactions.positives
    );
  } else if (isNegativeReaction(interaction)) {
    reactions.negatives = calculateNewReactionsValues(
      interaction.type,
      reactions.negatives
    );
  } else if (isAtenaReaction(interaction)) {
    reactions.others = calculateNewReactionsValues(
      interaction.type,
      reactions.others
    );
  }

  return reactions;
};

const convertToPositiveAndNegative = reactions => {
  if (
    typeof reactions.positives === "undefined" &&
    typeof reactions.negatives === "undefined"
  ) {
    let newReactions = {};
    newReactions.positives = 0;
    newReactions.negatives = 0;
    newReactions.others = parseInt(reactions, 10) || 0;

    return newReactions;
  }

  return reactions;
};

const calculateNewReactionsValues = (interactionType, reactions) => {
  if (interactionType === "reaction_added") {
    reactions += 1;
  } else if (interactionType === "reaction_removed") {
    reactions -= 1;
    reactions = reactions > 0 ? reactions : 0;
  }

  return reactions;
};
