import moment from 'moment-timezone'
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
  } else if (regex.isPro.test(message.msg)) {
    response = await users.commandPro(message)
    // } else if (regex.commands.test(message.msg)) {
    //   customCommands.show(message)
    // } else if (regex.darpontos.test(message.msg)) {
    //   customCommands.givePoints(message)
  } else if (regex.checkPro.test(message.msg)) {
    response = checkUserIsPro(message)
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

const checkUserIsPro = async message => {
  const isCoreTeam = await users.isCoreTeam(message.u._id)
  if (!isCoreTeam) return { msg: 'Ops! *Não tens acesso* a esta operação!' }

  const username = utils.getUsernameByMessage(message.msg)
  if (!username) return { msg: 'Ops! Você não nos mandou o *usuário*.' }

  const user = await users.findOne({ username: username })
  if (!user) return { msg: 'Usuário *não* encontrado.' }

  if (!user.pro) return { msg: 'Usuário *não possui* plano pro!' }

  const beginDate = user.proBeginAt
    ? moment(user.proBeginAt).format('L')
    : 'Sem data definida'

  const finishDate = user.proFinishAt
    ? moment(user.proFinishAt).format('L')
    : 'Sem data definida'

  return {
    msg: 'Usuário *possui* plano pro!',
    attachments: [
      {
        text: `Plano iniciou em ${beginDate} e terminará em ${finishDate}`
      }
    ]
  }
}

export default {
  getCommandsText,
  getCoreTeamCommandsText,
  getCommandMessage
}
