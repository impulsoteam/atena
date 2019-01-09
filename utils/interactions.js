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
