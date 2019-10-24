import config from 'config-yml'
import errors from '../errors'
import service from './blogService'
import interactions from '../interactions'
import settings from '../settings'
import users from '../users'

const file = 'Blog | Controller'

const save = async data => {
  let response = false
  try {
    if (!service.isValidPost(data)) return response

    const hasInteraction = await service.findInteractionByPostId(data.post_id)
    if (hasInteraction) return

    const user = await service.findUser(data)
    if (user) {
      const obj = {
        id: data.post_id,
        origin: 'blog',
        type: 'article',
        title: data.post.post_title,
        user: user.email
      }

      await interactions.handle(obj)
      response = true
    } else {
      errors._throw(file, 'save', 'user not found on blog')
    }
  } catch (e) {
    errors._throw(file, 'save', e)
  }

  return response
}

const normalize = data => {
  if (data.type == 'comment') {
    return {
      origin: 'blog',
      type: data.type,
      user: data.user,
      thread: false,
      description: 'comment on blog',
      channel: data.id,
      category: config.categories.network.type,
      action: config.actions.blog.type,
      score: config.xprules.blog.comment
    }
  } else if (data.type == 'article') {
    return {
      origin: 'blog',
      type: 'article',
      channel: data.id,
      date: new Date(),
      description: data.title,
      messageIdentifier: data.id,
      parentMessage: null,
      thread: false,
      user: data.user,
      category: config.categories.network.type,
      action: config.actions.blog.type,
      score: config.xprules.blog.post
    }
  }
}

const getDailyLimit = async () => {
  return settings.getValue('blog_daily_limit')
}

const isFlood = () => {
  return false
}

const findOrCreateUser = async interaction => {
  return users.findOne({ email: interaction.user })
}

export default {
  save,
  normalize,
  getDailyLimit,
  isFlood,
  findOrCreateUser
}
