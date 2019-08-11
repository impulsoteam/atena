import users from '../users'

const findOrCreateUser = async data => {
  return (await users.findOne({ uuid: data.uuid })) || {}
}

export default {
  findOrCreateUser
}
