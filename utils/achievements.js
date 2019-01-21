import config from "config-yml";

export const getInteractionType = interaction => {
  let type = interaction.type;

  if (isChatInteraction(interaction)) {
    type = "sended";
  }

  return type;
};

const isChatInteraction = interaction => {
  return (
    interaction.type === "reaction_added" ||
    interaction.type === "reaction_removed" ||
    interaction.type === "thread" ||
    interaction.type === "manual" ||
    interaction.type === "inactivity" ||
    (interaction.type === "message" &&
      interaction.action === config.actions.message.type)
  );
};
