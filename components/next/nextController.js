import service from './nextService'
import users from '../users'
import errors from '../errors'
import workers from '../workers'

const file = 'Next | Controller'

const handleUser = async data => {
  try {
    let user = await service.findOrCreateUser(data)

    user.rocketId = data.rocket_chat.id
    user.name = data.fullname
    user.email = data.network_email
    user.linkedinId = data.linkedin.uid
    user.username = data.rocket_chat.username
    user.avatar = data.rocket_chat.avatar
    user.uuid = data.uuid
    user.pro = users.receiveProPlan(data)
    user.proBeginAt = users.getProBeginDate(user, data)
    user.proFinishAt = users.getProFinishDate(user, data)

    return users.save(user)
  } catch (e) {
    errors._throw(file, 'handleUser', e)
  }
}

const sendToQueue = user => {
  const data = {
    uuid: user.uuid,
    current_plan: {
      name: user.level > 2 ? 'Atena - Level' : 'Atena - Cargo',
      begin_at: user.proBeginAt,
      finish_at: user.proFinishAt
    }
  }

  return workers.publish(data)
}

export default {
  handleUser,
  sendToQueue
}
