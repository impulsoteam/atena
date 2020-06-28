import moment from 'moment'

import { scoreTypes } from '../../models/Score/schema'
import User from '../../models/User'
import BotController from '../BotController'
import RankingController from '../RankingController'
import ScoreController from '../ScoreController'

export default class CommandUtils {
  getCommandsText({ isCoreTeam }) {
    const message = {
      msg: '*Eis a nossa lista de comandos!*',
      attachments: [
        {
          text:
            'Digite *!meuspontos* para verificar teus pontos de reputação e nível!'
        },
        { text: 'Digite *!minhasconquistas* para verificar tuas conquistas!' },
        {
          text:
            'Digite *!rankinggeral* e veja o ranking geral e a tua posição nele!'
        },
        {
          text: `Digite *!ranking* e veja o ranking do mês atual e tua posição nele!
          Além disso, podes escolher um mês e/ou ano específico.
          Basta adicionar um número de 1 à 12 para o mes e/ou um ano com quatro dígitos!
          Ficou com duvida? basta seguir os exemplos abaixo:
          *!ranking* para o ranking do mês e ano atual.
          *!ranking 2* para o mês de Fevereiro deste ano.
          *!ranking 2 2018* para o mês de Fevereiro de 2018.`
        }
      ]
    }

    if (isCoreTeam)
      message.attachments.push(
        {
          text: `Digite \`!darpontos\` \`@lista @usuários\` \`pontos\` \`motivo\` para dar pontos de reputação ao usuário. `
        },
        {
          text: `Digite ${'`!checkinfos`'} ${'`@nome-usuário`'} para checar dados relevantes do usuário. `
        },
        {
          text: `Digite ${'`!hey`'} ${'`@nome-usuário`'} e/ou ${'`#nome-canal`'} e, na linha abaixo, a mensagem desejada para enviar uma mensagem para vários canais e/ou usuários.

          Ficou com duvida? Olha esse exemplo:

          ${'`!hey`'} ${'`@fulano-1`'} ${'`@fulano-2`'} ${'`#canal-1`'} ${'`#canal-2`'}
          Hello world!`
        }
      )
    return message
  }

  getCoreTeamCommandsText() {
    return [
      {
        text: `Digite \`!darpontos\` \`@lista @usuários\` \`pontos\` \`motivo\` para dar pontos de reputação ao usuário. `
      },
      {
        text: `Digite ${'`!checkinfos`'} ${'`@nome-usuario`'} para checar dados relevantes do usuário. `
      }
    ]
  }

  getDateFromMessage(content) {
    let year = moment().format('YYYY')
    let month = moment().format('M')

    const isValidMonth = month => /(^0?[1-9]$)|(^1[0-2]$)/.test(month)
    const isValidYear = year => /^20(1[8-9]|[2-9][0-9])$/.test(year)

    const [, monthFromMessage, yearFromMessage] = content.trim().split(' ')

    if (isValidMonth(monthFromMessage)) {
      month = monthFromMessage
    }
    if (isValidYear(yearFromMessage)) {
      year = yearFromMessage
    }
    const fullDate = moment(`${year}/${month}`, 'YYYY/MM').toDate()
    return {
      date: fullDate,
      monthName: moment(fullDate).locale('pt').format('MMMM')
    }
  }

  generateRankingMessage({ ranking, user, monthName }) {
    if (!ranking || ranking.length < 5)
      return 'Ops. Ainda não temos dados suficientes para gerar o ranking neste momento. :/'

    const type = monthName ? `de ${monthName}` : 'geral'

    const response = {
      msg: `Olá ${
        user.name.split(' ')[0]
      }! Veja as primeiras pessoas do ranking ${type}:`,
      attachments: []
    }

    const topFive = ranking.slice(0, 5)

    response.attachments = topFive.map(
      ({ uuid, level, score, name }, index) => ({
        text: `${index + 1}º lugar está ${
          uuid === user.uuid ? 'você' : name
        } com ${score} pontos de reputação, no nível ${level}`
      })
    )

    const userPosition = user.isCoreTeam
      ? 'coreTeam'
      : ranking.findIndex(({ uuid }) => user.uuid === uuid) + 1

    let message = `Ah, e tu estás na posição ${userPosition} do ranking`

    if (userPosition === 'coreTeam') {
      message = `Psiu... Tu não estás no ranking pois pertence ao coreTeam. :/`
    }
    if (userPosition > 0 && userPosition < 6) {
      message = `Parabéns! Tu estás entre os 5 primeiros colocados`
    }
    if (userPosition === 0) {
      message = `Ah, e tu ainda não pontuaste ${monthName ? 'este mes. ' : '.'}`
    }

    response.attachments.push({
      text: message
    })

    return response
  }

  async generateUserScoresMessage(user) {
    const response = { msg: '', attachments: [] }

    if (user.isCoreTeam) {
      const { score } = await RankingController.getMonthlyPositionByUser(
        user.uuid
      )
      response.msg = `Olá ${
        user.name.split(' ')[0]
      }! Atualmente tu estás no nível ${user.level.value}.
        Como tu es do coreTeam, não possues posição no ranking geral ou mensal. :/
        Eis a sua pontuação até o momento:`

      response.attachments.push({
        text: `${score} pontos de reputação no ranking mensal!`
      })

      response.attachments.push({
        text: `${user.score.value} pontos de reputação no ranking geral!`
      })

      return response
    }

    const monthly = await RankingController.getMonthlyPositionByUser(user.uuid)
    const general = await RankingController.getGeneralPositionByUser(user.uuid)

    response.msg = `Olá ${
      user.name.split(' ')[0]
    }! Atualmente tu estás no nível ${user.level.value}.
      Eis tua pontuação em nossos rankings:`

    if (monthly.score) {
      response.attachments.push({
        text: `${monthly.score} pontos de reputação no ranking mensal!
        Tu estás na posição ${monthly.position} :grin: `
      })
    } else {
      response.attachments.push({
        text: `Tu ainda não pontuaste no ranking mensal`
      })
    }

    if (general.score) {
      response.attachments.push({
        text: `${general.score} pontos de reputação no ranking geral!
        Tu estás na posição ${general.position} :partying_face:`
      })
    } else {
      response.attachments.push({
        text: `Tu ainda não pontuaste no ranking geral`
      })
    }
    return response
  }

  generateAchievementsMessage(user) {
    const response = { msg: '', attachments: [] }

    if (!user.achievements.length) {
      response.msg = 'Ops! Você ainda não tem conquistas registradas. :('
      return response
    }

    response.msg = `Olá ${
      user.name.split(' ')[0]
    }, eis aqui as conquistas que solicitou:`

    for (const {
      displayNames,
      range,
      currentValue,
      nextTarget
    } of user.achievements) {
      response.attachments.push({
        text: `*${displayNames.achievement}*:
          \n Você é ${displayNames.medal} ${range} com ${currentValue}${
          nextTarget ? `/${nextTarget}` : ''
        }.`
      })
    }

    return response
  }

  getUserInfosText({ user, userBeingVerified }) {
    if (!user.isCoreTeam)
      return { msg: 'Ops! *Não tens acesso* a esta operação!' }

    if (!userBeingVerified) return { msg: 'Usuário *não* encontrado.' }

    return {
      msg: `*Usuário*: _${userBeingVerified.name}_`,
      attachments: [
        {
          text: `*Nível*: ${userBeingVerified.level.value}`
        },
        {
          text: `*Reputação*: ${userBeingVerified.score.value}`
        }
      ]
    }
  }

  async givePoints({ user, usernames, provider, points, reason }) {
    const response = {
      msg: 'Eis o resultado do seu comando: ',
      attachments: []
    }

    for (const username of usernames) {
      if (username === provider.user.username) {
        response.attachments.push({
          text: `Ops! *Não podes* dar pontos para ti mesmo.`
        })
        continue
      }

      const gifted = await User.findOne({
        [`${provider.name}.username`]: username
      })

      if (!gifted) {
        response.attachments.push({
          text: `Ops! Usuário *${username}* não encontrado.`
        })
        continue
      }

      try {
        await ScoreController.handleManualScore({
          user: gifted,
          provider: provider.name,
          payload: {
            user: gifted.uuid,
            score: points,
            description: scoreTypes.manual,
            details: {
              provider: provider.name,
              sender: user.uuid,
              reason
            }
          }
        })
      } catch (error) {
        response.attachments.push({
          text: `Opa, aconteceu algo inesperado. A pontuação de ${username} não foi enviada!`
        })
        continue
      }

      BotController.sendMessageToUser({
        provider: provider.name,
        message: {
          msg: `Acabaste de receber *${points} pontos* de reputação por *${reason}*.`
        },
        username: gifted[provider.name].username
      })

      response.attachments.push({
        text: `Sucesso! Enviaste *${points} pontos* de reputação para *${gifted.name}*!`
      })
    }
    BotController.sendMessageToUser({
      provider: provider.name,
      message: response,
      username: provider.user.username
    })
  }
}
