import LogController from '../../controllers/LogController'
import UserController from '../../controllers/UserController'
import { removeEmptyValues } from '../../utils'

export const handlePayload = ({ data, properties }) => {
  const types = {
    Impulser: () => handleUser(data)
  }
  const service = types[properties.type]
  service && service(data)
}

const handleUser = async data => {
  if (data.status === 'archived') return UserController.delete(data)

  try {
    const {
      uuid,
      fullname,
      email,
      rocket_chat,
      linkedin,
      google,
      photo_url
    } = data

    const user = {
      uuid,
      name: fullname,
      email,
      avatar: photo_url,
      rocketchat: {
        id: rocket_chat.id,
        username: rocket_chat.username
      },
      linkedin: { id: linkedin.uid },
      google: { id: google.uid }
    }

    removeEmptyValues(user)
    UserController.handle(user)
  } catch (error) {
    LogController.sendError(error)
  }
}
