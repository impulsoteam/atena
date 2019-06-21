import users from '../users'

const findOrCreateUser = async data => {
  return (await users.findOne({ rocketId: data.rocket_chat.id })) || {}
}

export default {
  findOrCreateUser
}
