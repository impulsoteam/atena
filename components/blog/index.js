import blog from './blogController'
import routes from './blogRoutes'

export default {
  ...blog,
  routes: routes
}
