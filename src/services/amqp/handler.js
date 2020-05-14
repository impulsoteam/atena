import AchievementController from '../../controllers/AchievementController'
import LogController from '../../controllers/LogController'
import ScoreController from '../../controllers/ScoreController'
import UserController from '../../controllers/UserController'
import { removeEmptyValues } from '../../utils'

export const handlePayload = ({ data, properties }) => {
  const types = {
    Impulser: handleUser,
    'Ahoy::Event': handleEvent
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

const handleEvent = async data => {
  const products = [
    'Chat',
    'Eventos Externos',
    'Meetups Internos',
    'Oportunidades',
    'Impulso TV',
    'Blog',
    'Curadoria',
    'Clube de Benefícios',
    'Comunidades.tech',
    'Communup',
    'Atena'
  ]

  const { properties, impulser_uuid, time } = data

  if (!properties.name || !products.includes(properties.name)) return

  if (!impulser_uuid || !time)
    return LogController.sendError({
      file: 'services/amqp/handler - handleEvent',
      resume: `Payload with missing values`,
      details: { payload: data }
    })

  const achievementType = `clickOnProduct | ${properties.name}`
  const payload = {
    uuid: impulser_uuid,
    achievementType,
    provider: { name: 'impulser.app' },
    description: 'clickOnProduct',
    product: properties.name,
    time
  }

  const user = await ScoreController.handleClickOnProduct(payload)
  AchievementController.handle({
    user,
    achievementType,
    provider: 'impulser.app'
  })
}
