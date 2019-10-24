import dal from './usersLevelsHistoryDAL'

const findOrCreate = async (userId, level, kind) => {
  let history = await dal.findOne({
    user: userId,
    level: level,
    kind: kind
  })

  if (!history) {
    history = {
      user: userId,
      kind: kind,
      level: level
    }
  }

  return history
}

export default {
  findOrCreate
}
