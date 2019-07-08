// import Interaction from '../../models/interaction'

// describe('[Models] Interaction', () => {
//   let interaction
//   beforeEach(() => {
//     interaction = new Interaction({
//       type: 'message',
//       channel: 'ABCDEFGG',
//       description: 'some description',
//       user: '123456',
//       thread: true
//     })
//   })

//   describe('validations', () => {
//     it('should be valid with valid attributes', () => {
//       expect(interaction.validate).toBeTruthy()
//     })

//     it('should be invalid if type is empty', () => {
//       interaction.type = null
//       interaction.validate(err => {
//         expect(err.errors.type).toBeTruthy()
//       })
//     })

//     it('should be invalid if channel is empty', () => {
//       interaction.channel = null
//       interaction.validate(err => {
//         expect(err.errors.channel).toBeTruthy()
//       })
//     })
//     it('should be invalid if description is empty', () => {
//       interaction.description = null
//       interaction.validate(err => {
//         expect(err.errors.description).toBeTruthy()
//       })
//     })
//   })
// })
