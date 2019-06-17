import controller from './rocketController'

export default {
  exec: controller.exec,
  normalize: controller.normalize,
  sendMessageToUser: controller.sendMessageToUser,
  sendMessageToRoom: controller.sendMessageToRoom,
  getDailyLimit: controller.getDailyLimit,
  findOrCreateUser: controller.findOrCreateUser,
  isFlood: controller.isFlood
}
