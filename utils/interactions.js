import config from "config-yml";
import interactionController from "../controllers/interaction";

export const lastMessageTime = async interaction => {
  let date = 0;
  const data = await interactionController.lastMessage(interaction);
  if (data.length > 0) {
    date = data[0].date;
  }
  return date;
};

export const getChannel = e => {
  return e.origin === "rocket" || e.type === "article"
    ? e.channel
    : e.item.channel;
};

export const isChatInteraction = interaction => {
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
