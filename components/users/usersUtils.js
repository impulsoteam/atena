import config from 'config-yml'
import commandsUtils from '../commands/commandsUtils'

const calculateLevel = score =>
  config.levelrules.levels_range.findIndex(l => score < l) + 1

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
  const regex = /(!darpontos) (@[a-z\-]+) ([\d]+) "(.+?)"/g
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

export default {
  calculateLevel,
  getUsernameByMessage,
  getWelcomeMessage,
  getSendedPointsUser,
  getSendedPointsValue,
  getSendedPointsReason
}
