import users from './usersController'
import routes from './usersRoutes'

export default {
  ...users,
  routes: routes
}
