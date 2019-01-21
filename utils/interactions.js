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
  return e.type === "message" || e.type === "article"
    ? e.channel
    : e.item.channel;
};

export const getAction = data => {
  return data.type === "article"
    ? config.actions.blog.type
    : config.actions.message.type;
};
