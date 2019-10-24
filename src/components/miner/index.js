import miner from './minerController'
import routes from './minerRoutes'

export default {
  ...miner,
  routes: routes
}
