import UserController from '../../controllers/UserController'
import LogController from '../../controllers/LogController'

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
      }
    }
    !!linkedin.uid && (user.linkedin = { id: linkedin.uid })
    !!google.uid && (user.google = { id: google.uid })

    UserController.handle(user)
  } catch (error) {
    LogController.sendError(error)
  }
}
