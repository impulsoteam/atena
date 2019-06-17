import controller from './achievementsTemporaryDataController'
import routes from './achievementsTemporaryDataRoutes'

export default {
  routes: routes,
  getByQuery: controller.getByQuery,
  getByInteraction: controller.getByInteraction
}
