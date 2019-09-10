import config from 'config-yml'
import dal from './interactionsDAL'
import github from '../github'
import blog from '../blog'
import rocket from '../rocket'
import users from '../users'
import achievements from '../achievements'
import achievementsTemporary from '../achievementsTemporary'

const normalize = (data, moduleController = false) => {
  let interaction = false
  if (data.type === 'manual') {
    interaction = {
      origin: 'sistema',
      type: data.type,
      user: data.user,
      rocketUsername: data.username,
      value: data.value,
      thread: false,
      description: data.text,
      channel: 'mundão',
      category: config.categories.network.type,
      action: 'manual',
      score: data.score || 0
    }
  } else if (data.type === 'inactivity') {
    interaction = {
      origin: 'sistema',
      type: data.type,
      user: data.user,
      thread: false,
      description: 'ação do sistema',
      channel: 'matrix',
      category: config.categories.network.type,
      action: 'inactivity',
      score: data.score || 0
    }
  } else {
    interaction = moduleController.normalize(data)
  }

  return interaction
}

const getModuleController = data => {
  const controllers = {
    github: github,
    rocket: rocket,
    blog: blog
  }

  return controllers[data.origin] || {}
}

const hasScore = async (moduleController, interaction) => {
  const dailyLimit = await isOnDailyLimit(moduleController, interaction)
  const flood = await isFlood(moduleController, interaction)
  return dailyLimit && !flood
}

const isFlood = async (moduleController, interaction) => {
  return moduleController.isFlood(interaction) || false
}

const isOnDailyLimit = async (moduleController, interaction) => {
  const todayLimitScore = await getDailyLimit(moduleController)
  const todayScore = await getTodayScore(interaction.user)
  const todayLimitStatus = todayLimitScore - todayScore
  return todayLimitStatus > 0 || !todayLimitStatus
}

const getDailyLimit = async moduleController => {
  const moduleLimit = await moduleController.getDailyLimit()
  return moduleLimit || config.xprules.limits.daily
}

const getTodayScore = async userId => {
  const interactions = await dal.findAllFromToday(userId)
  return interactions.reduce(
    (prevVal, interaction) => prevVal + interaction.score,
    0
  )
}

const onSaveInteraction = async (interaction, user) => {
  await users.updatePro(user)
  await users.updateScore(user, interaction.score)
  await achievements.handle(interaction, user)
  await achievementsTemporary.handle(interaction, user)
}

const changeUserId = async (limit = 1000, skip = 0) => {
  const allUsers = await users.find({}, { _id: 1 }, limit, skip)

  const promises = allUsers.map(async user => {
    await dal.updateMany(
      {
        $or: [
          {
            user: user.username
          },
          {
            user: user.rocketId || user.slackId
          }
        ]
      },
      {
        user: user._id
      }
    )
    return user._id
  })

  const usersId = await Promise.all(promises)
  return { total: usersId.length, users: usersId }
}

const findByDate = async (year, month) => {
  return dal.aggregate([
    {
      $match: {
        date: {
          $lt: new Date(year, month, 1),
          $gte: new Date(year, month - 1, 1)
        },
        score: { $gt: 0 }
      }
    },
    {
      $group: {
        _id: { user: '$user' },
        date: { $first: '$date' },
        totalScore: { $sum: '$score' }
      }
    },
    {
      $sort: { totalScore: -1 }
    }
  ])
}

const getMostActivesUsers = async (
  begin,
  end,
  channel = false,
  minCount = 6
) => {
  let queryMatch = {
    date: { $gte: begin, $lte: end },
    count: { $gte: minCount }
  }

  if (channel) {
    queryMatch = {
      ...queryMatch,
      channel: { $eq: channel }
    }
  }

  return dal.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userDetails'
      }
    },
    {
      $unwind: {
        path: '$userDetails',
        includeArrayIndex: '_id',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: {
          _id: '$userDetails._id',
          name: '$userDetails.name',
          rocketId: '$userDetails.rocketId',
          username: '$userDetails.username',
          channel: '$channel'
        },
        count: { $sum: 1 },
        date: { $first: '$date' }
      }
    },
    {
      $match: queryMatch
    },
    {
      $sort: { count: -1 }
    }
  ])
}

export default {
  getModuleController,
  onSaveInteraction,
  getMostActivesUsers,
  hasScore,
  normalize,
  changeUserId,
  findByDate
}
