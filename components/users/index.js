import controller from './usersController'

export default {
  findAllToRanking: controller.findAllToRanking,
  findBy: controller.findBy,
  isCoreTeam: controller.isCoreTeam,
  updateScore: controller.updateScore,
  commandScore: controller.commandScore,
  commandPro: controller.commandPro
}
