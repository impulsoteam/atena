import axios from 'axios'
import inviteUserToChannelQueue from '../queues/inviteUserToChannelQueue'

const api = axios.create({
  baseURL: `${process.env.ROCKETCHAT_URL}/api/v1`,
  headers: {
    'X-User-Id': process.env.ROCKETCHAT_ADMIN_USER_ID,
    'X-Auth-Token': process.env.ROCKETCHAT_ADMIN_USER_TOKEN
  }
})

const getUserInfoByUsername = username => {
  return api
    .get(`/users.info?username=${username}`)
    .then(response => response.data.user)
}

const getChannelsList = () => {
  return api
    .get('/channels.list?count=0&sort={"name":1}')
    .then(response => response.data.channels)
}

const getUserChannelsList = username => {
  const url = `/users.info?username=${username}&fields={"userRooms":1}`
  return api.get(url).then(response => {
    return response.data.user.rooms.filter(room => ['c', 'p'].includes(room.t))
  })
}

const inviteUserToChannel = (userId, roomId, type = 'c') => {
  const endpoint = type === 'c' ? '/channels.invite' : '/groups.invite'
  return api.post(endpoint, { userId, roomId })
}

const inviteUserToNotJoinedChannels = async username => {
  const [user, userChannels, allChannels] = await Promise.all([
    getUserInfoByUsername(username),
    getUserChannelsList(username),
    getChannelsList()
  ])

  const userChannelsNames = userChannels.map(channel => channel.name)
  const channelsNotIn = allChannels.filter(
    channel => !userChannelsNames.includes(channel.name)
  )
  const promises = channelsNotIn.map((channel, index) => {
    return inviteUserToChannelQueue.add(
      {
        userId: user._id,
        roomId: channel._id,
        type: channel.t
      },
      {
        delay: index * 10000
      }
    )
  })

  return Promise.all(promises)
}

export default {
  getUserInfoByUsername,
  getChannelsList,
  getUserChannelsList,
  inviteUserToChannel,
  inviteUserToNotJoinedChannels
}
