import controller from './interactionsController'

export default {
  saveManual: controller.saveManual,
  normalize: controller.normalize,
  handle: controller.handle,
  getLastMessage: controller.getLastMessage,
  findOne: controller.findOne
}
