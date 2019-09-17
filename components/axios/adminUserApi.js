import axios from 'axios'
import { apiBaseUrl } from './utils'

const adminUserApi = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'X-User-Id': process.env.ROCKETCHAT_ADMIN_USER_ID,
    'X-Auth-Token': process.env.ROCKETCHAT_ADMIN_USER_TOKEN
  }
})

const getChannelsList = () => {
  return this.get('/channels.list?count=0&sort={"name":1}').then(
    response => response.data.channels
  )
}

const getUserChannelsList = username => {
  const url = `/users.info?username=${username}&fields={"userRooms":1}`
  return this.get(url).then(response => {
    return response.data.user.rooms.filter(room => ['c', 'p'].includes(room.t))
  })
}

const inviteUserToChannel = (userId, roomId, type = 'c') => {
  const endpoint = type === 'c' ? '/channels.invite' : '/groups.invite'
  return this.post(endpoint, { userId, roomId })
}

Object.assign(adminUserApi, {
  getChannelsList,
  getUserChannelsList,
  inviteUserToChannel
})

export default adminUserApi
