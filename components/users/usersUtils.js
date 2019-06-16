import config from 'config-yml'

const calculateLevel = score =>
  config.levelrules.levels_range.findIndex(l => score < l) + 1

export default {
  calculateLevel
}
