import dal from './achievementsLevelDAL'
import utils from './achievementsLevelUtils'
import interactions from '../interactions'
import users from '../users'
import messages from '../messages'
import interactionsUtils from '../interactions/interactionsUtils'
import interactionsController from '../interactions/interactionsController'

const findOrCreate = async userId => {
  let achievement = await dal.findByUser(userId)
  if (!achievement) achievement = await create(userId)
  return achievement
}

const create = async userId => {
  const achievement = utils.generateNewAchievement(userId)
  return dal.save(achievement)
}

const update = async (achievement, level) => {
  achievement.ratings = utils.setRangesEarnedDates(achievement.ratings, level)
  achievement.record = utils.getRecord(achievement)
  return dal.save(achievement)
}

const addScore = async (achievement, userId) => {
  const score = utils.getScore(achievement)
  const user = await users.findOne({ _id: userId })

  if (score > 0) {
    await saveScoreInteraction(user, achievement, score, 'Conquista de Nível')
    await users.updateScore(user, score)
  }

  await sendEarnedMessage(user)
}

const sendEarnedMessage = async user => {
  if (!user.username) return

  await sendMessageToUser(user)
  await sendMessageToRoom(user)
}

const sendMessageToUser = async user => {
  const message = `:medal: Você obteve o *Nível ${user.level}*!`
  await messages.sendToUser(message, user.username)
}

const sendMessageToRoom = async user => {
  const message = `:medal: @${user.username} obteve o *Nível ${user.level}*!`
  const room = await getRoomToSendMessage(user)
  await messages.sendToRoom(message, room)
}

const getRoomToSendMessage = async user => {
  const interaction =
    (await interactionsController.getLastMessage(user._id)) || {}
  return interactionsUtils.getRoomToSendMessage(interaction)
}

const saveScoreInteraction = async (user, achievement, score, text) => {
  return interactions.saveManual({
    user: user._id,
    rocketUsername: user.username,
    score: score,
    value: achievement._id,
    text: text
  })
}

const getMessages = async userId => {
  const achievements = await dal.findByUser(userId)
  return utils.generateMessages(achievements)
}

export default {
  getMessages,
  findOrCreate,
  update,
  create,
  addScore
}
