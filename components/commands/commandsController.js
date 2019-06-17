import moment from 'moment'
import service from './commandsService'
import utils from './commandsUtils'
import users from '../../controllers/user'
import messages from '../messages'

const handle = async message => {
  const response = await service.getCommandMessage(message)
  if (response) {
    await messages.sendToUser(response, message.u.username)
  }
}

const show = async req => {
  const username = req.u.username
  const commandsText = utils.getCommandsText()
  const coreTeamCommandsText = await utils.getCoreTeamCommandsText(username)
  const response = {
    msg: '*Eis a nossa lista de comandos!*',
    attachments: [...commandsText, ...coreTeamCommandsText]
  }

  await messages.sendToUser(response, username)
}

const givePoints = async data => {
  const { msg, u } = data
  const isCoreTeam = await users.isCoreTeam({ username: u.username })
  // eslint-disable-next-line no-useless-escape
  const checkFields = /(@[a-z\-]+) ([\d]+) (`.+`)/g
  const result = checkFields.exec(msg)
  let user
  let errorMessage

  if (!isCoreTeam) {
    errorMessage = {
      msg: 'Opa!! *Não tens acesso* a esta operação!'
    }
  } else if (!result) {
    errorMessage = {
      msg: `Opa, tem algo *errado* no seu comando!
      Tente usar desta forma:
      ${'`!darpontos`'} ${'`@nome-usuario`'} ${'`pontos`'} ${'`motivo`'}
      Ah! E o motivo deve estar entre acentos agudos!`
    }
  }

  if (errorMessage) {
    driver.sendDirectToUser(errorMessage, u.username)
    return
  }

  try {
    user = await users.findBy({
      username: result[1].replace('@', '')
    })
  } catch (error) {
    errorMessage = {
      msg: 'Usuario *não* encontrado!'
    }
    driver.sendDirectToUser(errorMessage, u.username)
    return
  }
  const oldScore = user.score
  const score = parseInt(result[2])
  const messageToUser = result[3].replace('`', '').slice(0, -1)

  const sucess = await users.updateScore(user, score)

  if (sucess.score > oldScore) {
    const confirmMessage = {
      msg: `Sucesso! Enviaste *${score} pontos de experiencia* para ${user.name}!`
    }
    const notificationMessage = {
      msg: `Acabaste de receber *${score} pontos* de experiência por *${messageToUser}*.`
    }

    driver.sendDirectToUser(confirmMessage, u.username)
    driver.sendDirectToUser(notificationMessage, user.username)
  } else {
    errorMessage = {
      msg: 'Opa, aconteceu algo inesperado. Tua pontuação não foi enviada!'
    }
    driver.sendDirectToUser(errorMessage, u.username)
  }
}

export default {
  show,
  givePoints,
  handle
}
