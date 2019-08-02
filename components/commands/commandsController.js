import service from './commandsService'
import messages from '../messages'

const handle = async message => {
  const response = await service.getCommandMessage(message)
  if (response) {
    await messages.sendToUser(response, message.u.username)
  }
}

export default {
  handle
}
