import config from 'config-yml'
import commandsUtils from '../commands/commandsUtils'

const calculateLevel = score =>
  config.levelrules.levels_range.findIndex(l => score < l) + 1

const getUsernameByMessage = message => {
  return commandsUtils.getUsernameByMessage(message)
}

export default {
  calculateLevel,
  getUsernameByMessage
}
