import config from "config-yml";
import interactionController from "../controllers/interaction";

export const lastMessageTime = async userId => {
  let data = await interactionController.lastMessage(userId);

  try {
    data[0].date;
  } catch (e) {
    data = 0;
  }

  return data;
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
