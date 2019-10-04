import moment from 'moment-timezone'
import dal from './interactionsDAL'
import service from './interactionsService'

let moduleController

const saveManual = data => {
  const interaction = service.normalize(data)
  return dal.save(interaction)
}

const handle = async data => {
  moduleController = service.getModuleController(data)
  const interaction = await service.normalize(data, moduleController)
  const user = await moduleController.findOrCreateUser(interaction)
  interaction.user = user._id

  const countingScore = await service.hasScore(moduleController, interaction)
  if (!countingScore) interaction.score = 0

  await service.onSaveInteraction(interaction, user)

  interaction.messageId = data._id
  return dal.save(interaction)
}

const findByDate = async data => {
  return service.findByDate(data)
}

const getLastMessage = userId => {
  return dal.findLastMessageByUser(userId)
}

const findOne = query => {
  return dal.findOne(query)
}

const aggregate = query => {
  return dal.aggregate(query)
}

const changeUserId = (limit, skip) => {
  return service.changeUserId(limit, skip)
}

const getMostActivesUsers = async (begin, end, channel, minCount) => {
  begin = moment(begin, 'DD-MM-YYYY').startOf('day')
  end = moment(end, 'DD-MM-YYYY').endOf('day')

  if (!begin.isValid()) return { error: 'Data *begin* em formato inválido.' }
  if (!end.isValid()) return { error: 'Data *end* em formato inválido.' }
  if (end.diff(begin) < 0) return { error: 'Intervalo de datas em inválido.' }

  return service.getMostActivesUsers(
    begin.toDate(),
    end.toDate(),
    channel,
    minCount
  )
}

const messageExists = messageId => {
  return dal.messageExists(messageId)
}

export default {
  aggregate,
  findByDate,
  getLastMessage,
  saveManual,
  handle,
  findOne,
  changeUserId,
  getMostActivesUsers,
  messageExists
}
