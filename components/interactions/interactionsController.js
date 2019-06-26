import dal from './interactionsDAL'
import service from './interactionsService'
import users from '../users'

let moduleController

const saveManual = data => {
  data.type = 'manual'
  const interaction = service.normalize(data)
  return dal.save(interaction)
}

const handle = async data => {
  moduleController = service.getModuleController(data)
  const interaction = service.normalize(data, moduleController)

  const countingScore = await service.hasScore(moduleController, interaction)
  if (!countingScore) interaction.score = 0

  const user = await moduleController.findOrCreateUser(interaction)
  interaction.user = user._id

  if (user.score === 0 && user.username)
    await users.sendWelcomeMessage(user.username)

  await service.onSaveInteraction(interaction, user)
  return dal.save(interaction)
}

const findByDate = async (year, month) => {
  return service.findByDate(year, month)
}

const getLastMessage = userId => {
  return dal.findLastMessageByUser(userId)
}

const findOne = query => {
  return dal.findOne(query)
}

const changeUserId = (limit, skip) => {
  return service.changeUserId(limit, skip)
}

export default {
  findByDate,
  getLastMessage,
  saveManual,
  handle,
  findOne,
  changeUserId
}
