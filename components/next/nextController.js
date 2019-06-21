import service from './nextService'
import users from '../users'
import errors from '../errors'

const file = 'Next | Controller'

const handleUser = async data => {
  try {
    let user = await service.findOrCreateUser(data)
    user.rocketId = data.rocket_chat.id
    user.name = data.fullname
    user.email = data.network_email
    user.linkedinId = data.linkedin.uid
    user.username = data.rocket_chat.username
    user.uuid = data.uuid
    user.pro = users.receiveProPlan(data)
    user.proBeginAt = user.proBeginAt || data.current_plan.begin_at
    user.proFinishAt = user.proFinishAt || data.current_plan.finish_at

    return users.save(user)
  } catch (e) {
    errors._throw(file, 'handleUser', e)
  }
}

export default {
  handleUser
}
