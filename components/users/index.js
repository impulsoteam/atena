import controller from './usersController'

export default {
  findAllToRanking: controller.findAllToRanking,
  findBy: controller.findBy,
  findOne: controller.findOne,
  isCoreTeam: controller.isCoreTeam,
  updateScore: controller.updateScore,
  commandScore: controller.commandScore,
  commandPro: controller.commandPro,
  commandUserIsPro: controller.commandUserIsPro
}
