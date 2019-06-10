import interactionController from '../controllers/interaction'

export const lastMessageTime = async interaction => {
  let date = 0
  const data = await interactionController.lastMessage(interaction)
  if (data.length > 0) {
    date = data[0].date
  }
  return date
}
