import User from '../models/User'

class ImpulserController {
  async create(payload) {
    try {
      await User.create(payload)
    } catch (error) {
      console.log(error)
    }
  }
}

export default new ImpulserController()
