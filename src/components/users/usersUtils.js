import config from 'config-yml'
import commandsUtils from '../commands/commandsUtils'
import interactionsUtils from '../interactions/interactionsUtils'

const calculateLevel = score => {
  const levelsRange = config.levelrules.levels_range
  const lastValue = levelsRange.slice(-1)[0]

  if (score >= lastValue) return 10
  return levelsRange.findIndex(l => score < l) + 1
}

const getUsernameByMessage = message => {
  return commandsUtils.getUsernameByMessage(message)
}

const getWelcomeMessage = () => {
  return `Olá, Impulser! Eu sou *Atena*, deusa da sabedoria e guardiã deste reino! Se chegaste até aqui suponho que queiras juntar-se a nós, estou certa?! Vejo que tens potencial, mas terás que me provar que és capaz!
  Em meus domínios terás que realizar tarefas para mim, teus feitos irão render-te *Pontos de Experiência* que, além de fortalecer-te, permitirão que obtenhas medalhas de *Conquistas* em forma de reconhecimento! Sou uma deusa amorosa, por isso saibas que, eventualmente, irei premiar-te de maneira especial!

  Com o tempo, sentirás a necessidade de acompanhar o teu progresso. Por isso, podes consultar os livros de nossa biblioteca que contém tudo o que fizestes até então, são eles:

  - Pergaminhos de *Pontos de Experiência: !meuspontos*;
  - e os Tomos de *Conquistas: !minhasconquistas*.

  Ah! Claro que não estás só na realização destas tarefas. Os nomes dos(as) Impulsers estão dispostos nos murais no exterior de meu templo, esta é uma forma de reconhecer o teu valor e os teusesforços. Lá, tu encontrarás dois murais:

  - O *!ranking* ou *!ranking _nº do mês_* onde estão os nomes dos(das) que mais se esforçaram neste mês. Aquele(a) que estiver em primeiro lugar receberá uma recompensa especial;
  - e o *!rankinggeral* onde os nomes ficam dispostos, indicando toda a sua contribuição realizada até o presente momento.

  Uma última e importante informação, caso possuas acesso *a maior honraria* entre nós, o *Impulser PRO*, podes conferir o estado dele através do comando *!pro*.

  Sei que são muitas informações, mas caso te esqueças de algum dos comandos podes utilizar do *!comandos*. Também podes recorrer a este papiro, nele encontrarás *tudo o que precisa* saber em caso de dúvidas: *atena.impulso.network.*

  Espero que aproveite ao máximo *tua jornada* por aqui!`
}

const getSendedPointsOptions = async message => {
  // eslint-disable-next-line no-useless-escape
  const regex = /(!darpontos) (@[a-z0-9\-]+) ([\d]+) "(.+?)"/g
  const options = await regex.exec(message)
  return options
}
const getSendedPointsUser = async message => {
  const options = await getSendedPointsOptions(message)
  return options ? options[2].replace('@', '') : false
}

const getSendedPointsValue = async message => {
  const options = await getSendedPointsOptions(message)
  return options ? options[3] : false
}

const getSendedPointsReason = async message => {
  const options = await getSendedPointsOptions(message)
  return options ? options[4] : false
}

const calculateReactions = (interaction, reactions = {}) => {
  // FIXME: Remove after all users are updated
  reactions = convertToPositiveAndNegative(reactions)

  if (interactionsUtils.isPositiveReaction(interaction)) {
    reactions.positives = calculateNewReactionsValues(
      interaction.type,
      reactions.positives
    )
  } else if (interactionsUtils.isNegativeReaction(interaction)) {
    reactions.negatives = calculateNewReactionsValues(
      interaction.type,
      reactions.negatives
    )
  } else if (interactionsUtils.isAtenaReaction(interaction)) {
    reactions.others = calculateNewReactionsValues(
      interaction.type,
      reactions.others
    )
  }

  return reactions
}

const convertToPositiveAndNegative = reactions => {
  if (
    typeof reactions.positives === 'undefined' &&
    typeof reactions.negatives === 'undefined'
  ) {
    let newReactions = {}
    newReactions.positives = 0
    newReactions.negatives = 0
    newReactions.others = parseInt(reactions, 10) || 0

    return newReactions
  }

  return reactions
}

const calculateNewReactionsValues = (interactionType, reactions) => {
  if (interactionType === 'reaction_added') {
    reactions += 1
  } else if (interactionType === 'reaction_removed') {
    reactions -= 1
    reactions = reactions > 0 ? reactions : 0
  }

  return reactions
}

export default {
  calculateLevel,
  getUsernameByMessage,
  getWelcomeMessage,
  getSendedPointsUser,
  getSendedPointsValue,
  getSendedPointsReason,
  calculateReactions
}
