import controller from './rocketController'

export default {
  exec: controller.exec,
  sendMessageToUser: controller.sendMessageToUser,
  sendMessageToRoom: controller.sendMessageToRoom
}
