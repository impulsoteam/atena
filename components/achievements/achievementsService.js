import dal from './achievementsDAL'
import utils from './achievementsUtils'
import achievementsLevel from '../achievementsLevel'
import achievementsTemporary from '../achievementsTemporary'
import messages from '../messages'
import interactions from '../interactions'
import users from '../users'
import interactionsUtils from '../interactions/interactionsUtils'

const getAllMessages = async user => {
  let response = { msg: 'Ops! Você ainda não tem conquistas registradas. :(' }

  if (user) {
    let attachments = []
    const achievementsMessages = await getMessages(user._id)
    attachments = attachments.concat(achievementsMessages)

    const achievementsTemporaryMessages = await achievementsTemporary.getMessages(
      user._id
    )
    attachments = attachments.concat(achievementsTemporaryMessages)

    let achievementsLevelMessages = await achievementsLevel.getMessages(
      user._id
    )
    attachments = attachments.concat(achievementsLevelMessages)

    if (attachments.length) {
      response = {
        msg: `Olá ${user.name}, eis aqui as conquistas que solicitou:`,
        attachments: attachments
      }
    }
  }

  return response
}

const getMessages = async userId => {
  let achievements = await dal.findAllByUser(userId)
  return utils.generateAchievementsMessages(achievements)
}

const sendNewEarnedMessages = async (userId, achievement, interaction) => {
  const user = await users.findOne({ _id: userId })
  await sendEarnedMessage(
    user,
    utils.getCurrentRating(achievement),
    interaction
  )
}

const sendEarnedMessage = async (user, achievement, interaction) => {
  if (!user.username) return

  const name = achievement.name.split(' | ')
  await sendMessageToUser(user, achievement, name[1])
  // await sendMessageToRoom(user, achievement, name[1], interaction)
}

const sendMessageToUser = async (user, achievement, name) => {
  let message = `:medal: Você obteve a conquista [${achievement.rating} ${achievement.range} | ${name}]!`
  return messages.sendToUser(message, user.username)
}

const sendMessageToRoom = async (user, achievement, name, interaction) => {
  let publicMessage = `:medal: @${user.username} obteve a conquista [${achievement.rating} ${achievement.range} | ${name}]!`

  const room = interactionsUtils.getRoomToSendMessage(interaction)
  await messages.sendToRoom(publicMessage, room)
}

const addScore = async (user, achievement, interaction) => {
  const score = utils.calculateScoreToIncrease(achievement)

  if (score > 0) {
    await users.updateScore(user, score)
    await saveScoreInteraction(user, achievement, score, 'Conquista Permanente')
    await sendEarnedMessage(
      user,
      utils.getCurrentRating(achievement),
      interaction
    )
  }
}

const saveScoreInteraction = async (user, achievement, score, text) => {
  return interactions.saveManual({
    user: user._id,
    type: 'manual',
    rocketUsername: user.username,
    score: score,
    value: achievement._id,
    text: text
  })
}

const findOrCreate = async (user, interaction, type) => {
  const query = {
    user: user._id,
    kind: `${interaction.category}.${interaction.action}.${type}`
  }

  let achievement = await dal.findOne(query)
  if (!achievement) achievement = await create(interaction, type, user)

  return achievement
}

const create = async (interaction, type, user) => {
  const achievements = dal.findMain(
    interaction.category,
    interaction.action,
    type
  )

  const newAchievement = utils.generateNewAchievement(
    achievements,
    interaction,
    type,
    user
  )
  const achievement = await dal.save(newAchievement)
  await sendNewEarnedMessages(user, achievement, interaction)
  return achievement
}

export default {
  getAllMessages,
  getMessages,
  sendNewEarnedMessages,
  sendEarnedMessage,
  findOrCreate,
  create,
  addScore
}
