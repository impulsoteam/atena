import controller from './interactionsController'
import * as dal from './interactionDAL'

export default {
  save: controller.save,
  normalize: controller.normalize,
  dal: dal
}
