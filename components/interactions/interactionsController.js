import config from 'config-yml'
import dal from './interactionsDAL'

const convert = data => {
  if (data.type === 'manual') {
    return {
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
    return {
      origin: 'sistema',
      type: data.type,
      user: data.user,
      thread: false,
      description: 'ação do sistema',
      channel: 'matrix',
      category: config.categories.network.type,
      action: 'inactivity'
    }
    // TODO: add normalizes
    // } else if (data.origin === 'rocket') {
    //   return rocketController.normalize(data)
    // } else if (data.origin === 'blog') {
    //   return blogController.normalize(data)
    // } else if (data.origin === 'github') {
    //   return githubController.normalize(data)
  }
}

const save = interaction => {
  return dal.save(interaction)
}

export default {
  convert,
  save
}
