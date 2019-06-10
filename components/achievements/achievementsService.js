import achievementsDAL from './achievementsDAL'
import achievementsUtils from './achievementsUtils'
import { sendEarnedAchievementMessage } from '../../utils/achievementsMessages'
import { getAchievementCurrentRating } from '../../utils/achievements'
import userController from '../../controllers/user'
import achievementsLevel from '../achievementsLevel'
import achievementsTemporary from '../achievementsTemporary'

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
  let achievements = await achievementsDAL.findAllByUser(userId)
  return achievementsUtils.generateAchievementsMessages(achievements)
}

const sendEarnedMessages = async (userId, achievement) => {
  const user = await userController.findBy({ _id: userId })
  await sendEarnedAchievementMessage(
    user,
    getAchievementCurrentRating(achievement)
  )
}

const addFirstNewEarnedDate = achievement => {
  if (achievement.ratings[0].ranges[0].value === 1) {
    achievement.ratings[0].ranges[0].earnedDate = Date.now()
  }

  return achievement
}

export default {
  getAllMessages,
  getMessages,
  addFirstNewEarnedDate,
  sendEarnedMessages
}
