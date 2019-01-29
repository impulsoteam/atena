import { isChatInteraction } from "./interactions";

export const getInteractionType = interaction => {
  let type = interaction.type;

  if (isChatInteraction(interaction)) {
    type = "sended";
  }

  return type;
};
