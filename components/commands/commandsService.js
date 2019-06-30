import utils from './commandsUtils'
import users from '../users'
import rankings from '../rankings'
import achievements from '../achievements'

// import * as customCommands from '../components/commands'
// import {
//   auth as authGithub,
//   addRepository,
//   addRepositoryExcludedUser
// } from '../components/github'

const getCommandMessage = async message => {
  const regex = utils.getCommandsRegex()
  let response = false

  if (regex.meusPontos.test(message.msg)) {
    response = await users.commandScore(message)
  } else if (regex.rankingGeral.test(message.msg)) {
    response = await rankings.commandGeneral(message)
  } else if (regex.ranking.test(message.msg)) {
    response = await rankings.commandByMonth(message)
  } else if (regex.minhasConquistas.test(message.msg)) {
    await achievements.commandIndex(message)
  } else if (regex.isPro.test(message.msg)) {
    response = await users.commandPro(message)
  } else if (regex.commands.test(message.msg)) {
    response = await commandsList(message)
  } else if (regex.darpontos.test(message.msg)) {
    response = users.sendPoints(message)
  } else if (regex.checkPro.test(message.msg)) {
    response = await users.commandUserIsPro(message)
    // } else if (regex.openSource.test(message.msg)) {
    //   authGithub(message)
    // } else if (regex.openSourceAddRepository.test(message.msg)) {
    //   addRepository(message)
    // } else if (regex.openSourceAddRepositoryUser.test(message.msg)) {
    //   addRepositoryExcludedUser(message)
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
