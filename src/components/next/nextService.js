import users from '../users'

const findOrCreateUser = async data => {
  const user = await users.findOne({
    $or: [{ rocketId: data.rocket_chat.id }, { uuid: data.uuid }]
  })
  return user || {}
}

export default {
  findOrCreateUser
}
