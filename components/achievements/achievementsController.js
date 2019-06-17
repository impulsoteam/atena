import { driver } from '@rocket.chat/sdk'
import userController from '../../controllers/user'
import dal from './achievementsDAL'
import utils from './achievementsUtils'
import service from './achievementsService'

const commandIndex = async message => {
  const interaction = {
    origin: 'rocket',
    user: message.u._id
  }
  const user = await userController.findByOrigin(interaction)
  const response = await service.getAllMessages(user)
  await driver.sendDirectToUser(response, message.u.username)
}

const handle = async (interaction, user) => {
  if (utils.isValidAction(interaction)) {
    const type = utils.getInteractionType(interaction)
    await save(type, interaction, user)

    if (interaction.parentUser) {
      const parentUser = await userController.findByOrigin(interaction, true)
      await save('received', interaction, parentUser)
    }
  }
}

const save = async (type, interaction, user) => {
  const achievement = await service.findOrCreate(user, interaction, type)
  achievement.total += 1
  achievement.ratings = utils.setEarned(achievement)
  await service.addScore(user, achievement, interaction)
  return dal.save(achievement)
}

export default {
  handle,
  commandIndex
}
