import github from './githubController'
import routes from './githubRoutes'

export default {
  ...github,
  routes: routes
}
