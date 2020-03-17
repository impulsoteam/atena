import service from './nextService'
import users from '../users'
import errors from '../errors'
import workers from '../workers'
import interactions from '../interactions'
import achievements from '../achievements'

const file = 'Next | Controller'

const handleUser = async data => {
  if (data.status === 'archived') {
    return users.removeUserByUuid(data.uuid).catch(error => {
      errors._throw(file, 'handleUser', error)
    })
  }
  try {
    let isNew = false
    let user = await service.findOrCreateUser(data)
    const previousStep = user.nextStep
    if (!user.name) isNew = true

    user.rocketId = data.rocket_chat.id
    user.name = data.fullname
    user.email = data.network_email
    user.linkedinId = data.linkedin.uid
    user.username = data.rocket_chat.username
    user.avatar = data.photo_url
    user.uuid = data.uuid
    user.stacks = data.stacks
    user.pro = users.receiveProPlan(data)
    user.proBeginAt = users.getProBeginDate(data)
    user.proFinishAt = users.getProFinishDate(data)
    user.nextStep = data.step

    user = await users.save(user)
    if (user.nextStep && user.nextStep !== previousStep)
      achievements.handleNextStep(user)

    if (isNew) {
      await users.saveOnNewLevel(user)
      await interactions.saveManual({
        score: 0,
        value: 0,
        type: 'manual',
        user: user._id,
        username: user.username,
        text: 'Usuário criado a partir do Next'
      })
    }

    return user
  } catch (e) {
    errors._throw(file, 'handleUser', e)
  }
}

const sendUserLevelToQueue = user => {
  if (!user.uuid) return
  const data = {
    type: 'level_change',
    uuid: user.uuid,
    level: user.level
  }

  return workers.publish(data)
}

export default {
  handleUser,
  sendUserLevelToQueue
}
