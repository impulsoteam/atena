import config from 'config-yml'
import { driver } from '@rocket.chat/sdk'
import userController from '../../controllers/user'
import dal from './achievementsDAL'
import utils from './achievementsUtils'
import service from './achievementsService'
import { _throw } from '../error'

const file = 'AchievementController'

const commandIndex = async message => {
  try {
    const interaction = {
      origin: 'rocket',
      user: message.u._id
    }
    const user = await userController.findByOrigin(interaction)
    const response = await service.getAllMessages(user)
    await driver.sendDirectToUser(response, message.u.username)
  } catch (e) {
    _throw(file, 'commandIndex', e)
  }
}

const handle = async (interaction, user) => {
  try {
    if (utils.isValidAction(interaction)) {
      const type = utils.getInteractionType(interaction)
      await save(type, interaction, user)

      if (interaction.parentUser) {
        const parentUser = await userController.findByOrigin(interaction, true)
        await save('received', interaction, parentUser)
      }
    }
  } catch (e) {
    _throw(file, 'handle', e)
  }
}

const save = async (type, interaction, user) => {
  const achievement = await findOrCreate(user, interaction, type)
  achievement.total += 1
  achievement.ratings = utils.setEarned(achievement)
  await utils.addScore(user, achievement)
  return achievement.save()
}

const findOrCreate = async (user, interaction, type) => {
  const query = {
    user: user._id,
    kind: `${interaction.category}.${interaction.action}.${type}`
  }

  let achievement = await dal.findOne(query)
  if (!achievement) {
    achievement = await create(interaction, type, user)
  }

  return achievement
}

const create = (interaction, type, user) => {
  const achievements = dal.findMain(
    interaction.category,
    interaction.action,
    type
  )

  return utils.generateNewAchievement(achievements, interaction, type, user)
}

export default {
  handle,
  commandIndex
}
