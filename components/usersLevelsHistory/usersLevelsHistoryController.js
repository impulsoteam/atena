import service from './usersLevelsHistoryService'
import dal from './usersLevelsHistoryDAL'

const save = async (userId, oldLevel, newLevel) => {
  const kind = oldLevel < newLevel ? 'added' : 'subtracted'
  const history = await service.findOrCreate(userId, newLevel, kind)
  history.earnedDate = Date.now()
  return dal.save(history)
}

export default {
  save
}
