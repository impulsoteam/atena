import { renderScreen } from '../utils/ssr'
import checkPointModel from '../models/checkpoint'

const index = async (req, res) => {
  if (req.user && req.user.isCoreTeam) {
    const checkpoints = await checkPointModel.find()
    const initialData = {
      title: 'CheckPoints',
      page: 'checkpoint',
      data: checkpoints
    }
    renderScreen(req, res, 'Checkpoint', initialData)
  } else {
    return res.send('Sem Permissão')
  }
}

const new_record = async (req, res) => {
  if (req.user && req.user.isCoreTeam) {
    const initialData = {
      title: 'CheckPoint',
      page: 'checkpoint'
    }
    renderScreen(req, res, 'NewCheckpoint', initialData)
  } else {
    return res.send('Sem Permissão')
  }
}

const edit = async (req, res) => {
  if (req.user && req.user.isCoreTeam) {
    const checkpoint = await checkPointModel.findOne({ _id: req.params.id })
    const initialData = {
      title: 'Edit CheckPoint',
      page: 'checkpoint',
      data: checkpoint
    }
    renderScreen(req, res, 'EditCheckpoint', initialData)
  } else {
    return res.send('Sem Permissão')
  }
}

const save = async (req, res) => {
  if (req.user && req.user.isCoreTeam) {
    const { level, xp, rewards, totalEngagedUsers } = req.body
    const instance = checkPointModel({
      level: level,
      xp: xp,
      rewards: rewards.filter(item => item.length > 0),
      totalEngagedUsers: totalEngagedUsers
    })
    instance.save().then(() => {
      res.redirect('/checkpoints')
    })
  } else {
    return res.send('Sem Permissão')
  }
}

const update = async (req, res) => {
  if (req.user && req.user.isCoreTeam) {
    const { level, xp, rewards, totalEngagedUsers } = req.body
    const checkpoint = await checkPointModel.findOne({ _id: req.params.id })
    checkpoint.level = level
    checkpoint.xp = xp
    checkpoint.rewards = rewards.filter(item => item.length > 0)
    checkpoint.totalEngagedUsers = totalEngagedUsers
    checkpoint.save().then(() => {
      res.redirect('/checkpoints')
    })
  } else {
    return res.send('Sem Permissão')
  }
}

const delete_record = async (req, res) => {
  if (req.user && req.user.isCoreTeam) {
    await checkPointModel.deleteOne({ _id: req.params.id })
    res.redirect('/checkpoints')
  } else {
    return res.send('Sem Permissão')
  }
}

const exportFunctions = {
  index,
  new_record,
  save,
  edit,
  update,
  delete_record
}

export default exportFunctions
