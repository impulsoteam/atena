import checkpoints from './checkpointsController'
import routes from './checkpointsRoutes'

export default {
  ...checkpoints,
  routes: routes
}
