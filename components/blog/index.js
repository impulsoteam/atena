import controller from './blogController'
import routes from './blogRoutes'

export default {
  routes: routes,
  save: controller.save,
  normalize: controller.normalize,
  getDailyLimit: controller.getDailyLimit,
  isFlood: controller.isFlood,
  findOrCreateUser: controller.findOrCreateUser
}
