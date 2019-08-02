import errors from '../errors'
import dal from './checkpointsDAL'

const file = 'Checkpoints | Controller'

const getAll = async () => {
  try {
    return dal.findAll()
  } catch (e) {
    errors._throw(file, 'getAll', e)
  }
}

const getById = async checkpointId => {
  try {
    return dal.findOne({ _id: checkpointId })
  } catch (e) {
    errors._throw(file, 'getById', e)
  }
}

const create = async data => {
  try {
    const { level, xp, rewards, totalEngagedUsers } = data
    const checkpoint = {
      level: level,
      xp: xp,
      rewards: rewards.filter(item => item.length > 0),
      totalEngagedUsers: totalEngagedUsers
    }
    return dal.save(checkpoint)
  } catch (e) {
    errors._throw(file, 'create', e)
  }
}

const update = async (checkpointId, data) => {
  try {
    const { level, xp, rewards, totalEngagedUsers } = data
    const checkpoint = await dal.findOne({ _id: checkpointId })

    if (!checkpoint) return { error: 'Checkpoint not found' }

    checkpoint.level = level
    checkpoint.xp = xp
    checkpoint.rewards = rewards.filter(item => item.length > 0)
    checkpoint.totalEngagedUsers = totalEngagedUsers

    return dal.save(checkpoint)
  } catch (e) {
    errors._throw(file, 'update', e)
  }
}

const remove = async checkpointId => {
  try {
    const checkpoint = await dal.findOne({ _id: checkpointId })

    if (!checkpoint) return { error: 'Checkpoint not found' }

    return dal.deleteOne({ _id: checkpointId })
  } catch (e) {
    errors._throw(file, 'delete', e)
  }
}

export default {
  getAll,
  getById,
  create,
  update,
  remove
}
