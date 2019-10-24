import auth from './authController'
import routes from './authRoutes'

export default {
  ...auth,
  routes: routes
}
