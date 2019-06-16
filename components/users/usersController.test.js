import controller from './usersController'

describe('[USERS CONTROLLERS]', () => {
  // TODO: create user

  describe('### .updateScore(user, score)', () => {
    it('should return undefined if not pass an user', done => {
      controller.updateScore({}, 0).then(res => {
        console.log('res', res)
        done()
      })
    })
  })
})
