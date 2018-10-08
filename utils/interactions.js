import interactionController from "../controllers/interaction";

export const lastMessageTime = async userId => {
  const data = await interactionController.lastMessage(userId);

  return data[0].date;
};
