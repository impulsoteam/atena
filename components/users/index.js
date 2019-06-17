import controller from './usersController'

export default {
  findAllToRanking: controller.findAllToRanking,
  findBy: controller.findBy,
  findOne: controller.findOne,
  findOneAndUpdate: controller.findOneAndUpdate,
  isCoreTeam: controller.isCoreTeam,
  updateScore: controller.updateScore,
  commandScore: controller.commandScore,
  commandPro: controller.commandPro,
  commandUserIsPro: controller.commandUserIsPro,
  sendWelcomeMessage: controller.sendWelcomeMessage
}
