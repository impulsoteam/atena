import controller from './githubController'
// import * as dal from "./githubDAL"

module.exports = {
  events: controller.events,
  auth: controller.auth,
  addRepository: controller.add,
  addRepositoryExcludedUser: controller.addExcludedUser
}
