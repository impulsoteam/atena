import { driver } from '@rocket.chat/sdk'
import Interaction from '../interactions/interaction'
import dal from './achievementsDAL'
import utils from './achievementsUtils'
import service from './achievementsService'
import users from '../users'
import config from 'config-yml'

const commandIndex = async message => {
  const user = await users.findOne({ rocketId: message.u._id })
  const response = await service.getAllMessages(user)
  await driver.sendDirectToUser(response, message.u.username)
}

const handle = async (interaction, user) => {
  if (utils.isValidAction(interaction)) {
    const type = utils.getInteractionType(interaction)
    await save(type, interaction, user)

    if (interaction.parentUser) {
      const parentUser = await users.find({ rocketId: interaction.parentUser })
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

const findAllByUser = async userId => {
  const allAchievements = await dal.findAllByUser(userId)

  return allAchievements.map(a => {
    const data = utils.getCurrentRating(a)

    return {
      type: a.kind,
      name: data.name,
      medal: data.rating,
      tier: utils.getLastRatingEarned(a).range,
      score: a.total,
      maxScore: data.total
    }
  })
}

const handleNextStep = async ({ nextStep, username, _id }) => {
  const profileConfig = config['achievements-network']['profile']

  const { medal, status, reputation } = profileConfig[nextStep]

  const message = `:medal: @${username} obteve a conquista\
  [${medal} | Perfil ${status} Preenchido]\
  e ${reputation} pontos de reputação!`

  Interaction.create({
    origin: 'next',
    type: nextStep,
    user: _id,
    thread: false,
    description: config.actions.profile.name,
    channel: 'mundão',
    category: config.categories.network.type,
    score: reputation
  })

  driver.sendDirectToUser(message, username)
}

export default {
  handle,
  handleNextStep,
  commandIndex,
  findAllByUser
}
