import dal from './achievementsDAL'
import utils from './achievementsUtils'
import userController from '../../controllers/user'
import achievementsLevel from '../achievementsLevel'
import achievementsTemporary from '../achievementsTemporary'
import { sendToUser } from '../../rocket/bot'

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

const sendNewEarnedMessages = async (userId, achievement) => {
  const user = await userController.findBy({ _id: userId })
  await sendEarnedMessage(user, utils.getCurrentRating(achievement))
}

const sendEarnedMessage = async (
  user,
  achievement,
  isAchievementLevel = false
) => {
  const name = achievement.name.split(' | ')

  let privateMessage = `:medal: Você obteve a conquista [${
    achievement.rating
  } ${achievement.range} | ${name[1]}]!`

  // let publicMessage = `:medal: @${rocketUser.username} obteve a conquista [${
  //   achievement.rating
  // } ${achievement.range} | ${name[1]}]!`;

  if (isAchievementLevel) {
    privateMessage = `:medal: Você obteve o *Nível ${user.level}*!`
    // publicMessage = `:medal: @${rocketUser.username} obteve o *Nível ${
    //   user.level
    // }*!`;
  }

  await sendToUser(privateMessage, user.username)
  // await sendMessage(publicMessage, "impulso-network");
}

const addScore = async (user, achievement) => {
  const score = utils.calculateScoreToIncrease(achievement)

  if (score > 0) {
    await userController.updateScore(user, score)
    await utils.saveScoreInteraction(
      user,
      achievement,
      score,
      'Conquista Permanente'
    )
    await sendEarnedMessage(user, utils.getCurrentRating(achievement))
  }
}

export default {
  getAllMessages,
  getMessages,
  sendNewEarnedMessages,
  sendEarnedMessage,
  addScore
}
