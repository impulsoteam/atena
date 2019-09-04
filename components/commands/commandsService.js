import utils from './commandsUtils'
import users from '../users'
import rankings from '../rankings'
import achievements from '../achievements'
import github from '../github'

const getCommandMessage = async message => {
  const regex = utils.getCommandsRegex()
  let response = false

  if (regex.myPoints.test(message.msg)) {
    response = await users.commandScore(message)
  } else if (regex.rankingGeral.test(message.msg)) {
    response = await rankings.commandGeneral(message)
  } else if (regex.ranking.test(message.msg)) {
    response = await rankings.commandByMonth(message)
  } else if (regex.myAchievements.test(message.msg)) {
    await achievements.commandIndex(message)
  } else if (regex.isPro.test(message.msg)) {
    response = await users.commandPro(message)
  } else if (regex.commands.test(message.msg)) {
    response = await commandsList(message)
  } else if (regex.sendPoints.test(message.msg)) {
    response = users.sendPoints(message)
  } else if (regex.checkInfos.test(message.msg)) {
    response = await users.commandUserInfos(message)
  } else if (regex.openSourceRemoveRepositoryUser.test(message.msg)) {
    response = await github.removeRepositoryUser(message)
  } else if (regex.openSource.test(message.msg)) {
    response = await github.auth(message)
  } else if (regex.openSourceAddRepository.test(message.msg)) {
    response = await github.addRepository(message)
  }

  return response
}

const commandsList = async message => {
  let coreTeamCommandsText = []
  const commandsText = utils.getCommandsText()

  const isCoreTeam = await users.isCoreTeam(message.u._id)
  if (isCoreTeam) coreTeamCommandsText = utils.getCoreTeamCommandsText()

  return {
    msg: '*Eis a nossa lista de comandos!*',
    attachments: [...commandsText, ...coreTeamCommandsText]
  }
}

export default {
  getCommandMessage
}
