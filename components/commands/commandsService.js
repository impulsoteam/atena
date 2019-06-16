import utils from './commandsUtils'
import users from '../users'
import rankings from '../rankings'

// import { driver } from '@rocket.chat/sdk'
// import interactionController from '../controllers/interaction'
// import rankingController from '../controllers/ranking'
// import userController from '../controllers/user'
// import achievementsController from '../components/achievements'
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
    // } else if (regex.minhasConquistas.test(message.msg)) {
    //   await achievementsController.commandIndex(message)
    // } else if (regex.isPro.test(message.msg)) {
    //   users.isPro(message)
    // } else if (regex.commands.test(message.msg)) {
    //   customCommands.show(message)
    // } else if (regex.darpontos.test(message.msg)) {
    //   customCommands.givePoints(message)
    // } else if (regex.checkPro.test(message.msg)) {
    //   customCommands.checkPro(message)
    //   customCommands.show(message)
    // } else if (regex.openSource.test(message.msg)) {
    //   authGithub(message)
    // } else if (regex.openSourceAddRepository.test(message.msg)) {
    //   addRepository(message)
    // } else if (regex.openSourceAddRepositoryUser.test(message.msg)) {
    //   addRepositoryExcludedUser(message)
  }

  return response
}

const getCommandsText = () => {
  return utils.getCommandsText()
}

const getCoreTeamCommandsText = async username => {
  const isCoreTeam = await users.isCoreTeam({ username })
  let commands = []
  if (isCoreTeam) commands = utils.getCoreTeamCommandsText()
  return commands
}

export default {
  getCommandsText,
  getCoreTeamCommandsText,
  getCommandMessage
}
