// import MockDate from 'mockdate'
// import { driver } from '@rocket.chat/sdk'
// // import mockingoose from 'mockingoose';
// import interaction from './interaction'
// import interactionModel from '../models/interaction'
// import channelCheckPointModel from '../models/channelCheckPoint'
// import {
//   saveInteraction,
//   message,
//   responseEngagedSlash,
//   apiGetChannels
// } from '../mocks/rocket'
// import api from '../rocket/api'
// import userController from './user'
// import minerController from './miner'
// import config from 'config-yml'
// import achievementController from './achievement'
// import achievementTemporaryController from './achievementTemporary'

// jest.mock('../rocket/api')
// jest.mock('../rocket/bot', () => jest.fn())
// jest.mock('../utils')
// jest.mock('./user')
// jest.mock('./achievement')
// jest.mock('./achievementTemporary')
// jest.mock('@rocket.chat/sdk')

// describe('Interaction Controller', () => {
//   afterEach(() => {
//     jest.restoreAllMocks()
//     jest.clearAllMocks()
//   })
//   const mockFullUser = {
//     username: 'ikki',
//     reactions: { positives: 0, negatives: 0, others: 0 },
//     level: 0,
//     score: 0,
//     messages: 0,
//     replies: 0,
//     isCoreTeam: false,
//     teams: ['network'],
//     _id: '5c9d08cd4d5cb631a30741e3',
//     rocketId: '2BQ3wWnRBh7vXGYdP',
//     __v: 0,
//     lastUpdate: '2019-03-28T17:47:57.760Z',
//     name: 'Ikki de Fênix'
//   }

//   describe('todayScore', () => {
//     it('should return score equal 0', async done => {
//       const mockInteractions = [{ score: 0 }]
//       const user = '123456'
//       const spy = jest
//         .spyOn(interactionModel, 'find')
//         .mockImplementationOnce(() => Promise.resolve(mockInteractions))
//       interaction.todayScore(user).then(res => {
//         expect(spy).toHaveBeenCalled()
//         expect(res).toEqual(0)
//         done()
//       })
//     })

//     it('should return score not equal zero', async done => {
//       const mockInteractions = [{ score: 2 }]
//       const score = config.xprules.messages.send
//       const user = '123456'
//       const spy = jest
//         .spyOn(interactionModel, 'find')
//         .mockImplementationOnce(() => Promise.resolve(mockInteractions))
//       interaction.todayScore(user).then(res => {
//         expect(spy).toHaveBeenCalled()
//         expect(res).toEqual(score)
//         done()
//       })
//     })
//   })

//   describe('validInteraction', () => {
//     const mockLastMessage = {
//       _id: '5c9bfa0fac7f535bc808da67',
//       date: '2019-03-27T22:32:46.000Z'
//     }

//     it('should return rocket user', async done => {
//       const data = message
//       interaction.lastMessage = jest
//         .fn()
//         .mockReturnValue(Promise.resolve(mockLastMessage))
//       userController.valid = jest
//         .fn()
//         .mockReturnValue(new Promise(resolve => resolve(mockFullUser)))
//       interaction.validInteraction(data).then(response => {
//         expect(response).toEqual(mockFullUser)
//         done()
//       })
//     })

//     it('should return user makes flood', async done => {
//       const data = message
//       interaction.lastMessage = jest.fn().mockReturnValue(
//         new Promise((resolve, reject) => {
//           reject('usuario fez flood')
//         })
//       )
//       userController.valid = jest
//         .fn()
//         .mockReturnValue(new Promise(resolve => resolve(mockFullUser)))
//       interaction.validInteraction(data).catch(err => {
//         expect(err).toEqual('usuario fez flood')
//         done()
//       })
//     })
//   })

//   describe('save', () => {
//     describe('rocket origin', () => {
//       beforeEach(() => {
//         achievementTemporaryController.save = jest
//           .fn()
//           .mockReturnValue(new Promise(resolve => resolve(true)))
//         userController.customUpdate = jest
//           .fn()
//           .mockReturnValue(new Promise(resolve => resolve(true)))
//         interaction.todayScore = jest.fn().mockReturnValue(0)
//         achievementController.save = jest.fn().mockReturnValue(true)
//       })

//       it('should return reject promise when user not in rocket database', async done => {
//         const data = message
//         data.origin = 'rocket'
//         expect(interaction.save(message)).rejects.toEqual('add new interaction')
//         done()
//       })

//       it('should return successfully when user is on rocket database', async done => {
//         const data = message
//         data.origin = 'rocket'
//         jest
//           .spyOn(interactionModel.prototype, 'save')
//           .mockImplementationOnce(() => Promise.resolve(saveInteraction))
//         interaction.validInteraction = jest
//           .fn()
//           .mockReturnValue(new Promise(resolve => resolve(mockFullUser)))
//         interaction.save(message).then(response => {
//           expect(response).toEqual(saveInteraction)
//           done()
//         })
//       })

//       it('should return interaction whitout update score', async done => {
//         const data = message
//         const score = 0
//         data.origin = 'rocket'
//         const spy = jest
//           .spyOn(interactionModel.prototype, 'save')
//           .mockImplementationOnce(() => Promise.resolve(saveInteraction))

//         interaction.validInteraction = jest
//           .fn()
//           .mockReturnValue(new Promise(resolve => resolve(mockFullUser)))
//         interaction.save(data).then(res => {
//           expect(spy).toHaveBeenCalled()
//           expect(res.score).toEqual(score)
//           done()
//         })
//       })

//       it('should return interaction whith update score', async done => {
//         const data = message
//         const score = config.xprules.messages.send
//         data.origin = 'rocket'
//         const customSaveInteraction = {
//           ...saveInteraction,
//           score: 2
//         }
//         jest
//           .spyOn(interactionModel.prototype, 'save')
//           .mockImplementationOnce(() => Promise.resolve(customSaveInteraction))
//         interaction.validInteraction = jest
//           .fn()
//           .mockReturnValue(new Promise(resolve => resolve(mockFullUser)))
//         interaction.save(data).then(res => {
//           expect(res.score).toEqual(score)
//           done()
//         })
//       })

//       it('should return interaction with channel general saved', async done => {
//         const data = message
//         data.origin = 'rocket'
//         const customSaveInteraction = {
//           ...saveInteraction,
//           description: 'msg in general',
//           channel: 'GENERAL'
//         }
//         jest
//           .spyOn(interactionModel.prototype, 'save')
//           .mockImplementationOnce(() => Promise.resolve(customSaveInteraction))
//         interaction.validInteraction = jest
//           .fn()
//           .mockReturnValue(new Promise(resolve => resolve(mockFullUser)))
//         interaction.save(data).then(res => {
//           expect(res.channel).toEqual('GENERAL')
//           done()
//         })
//       })
//     })
//   })

//   describe('engaged', () => {
//     it('should return is not core team', async done => {
//       const mockReq = {
//         body: responseEngagedSlash
//       }
//       const mockRes = {
//         json: jest.fn()
//       }
//       const mockResponse = {
//         text:
//           'Você não tem uma armadura de ouro, e não pode entrar nessa casa!',
//         attachments: []
//       }

//       minerController.isMiner = jest
//         .fn()
//         .mockReturnValue(new Promise(resolve => resolve(false)))
//       userController.isCoreTeam = jest
//         .fn()
//         .mockReturnValue(new Promise(resolve => resolve(false)))
//       interaction.engaged(mockReq, mockRes).then(() => {
//         expect(mockRes.json).toHaveBeenCalledWith(mockResponse)
//       })
//       done()
//     })

//     it('should return wrong invalid dates', async done => {
//       const mockReq = {
//         body: {
//           ...responseEngagedSlash,
//           begin: '10/10/2019',
//           end: '10/10/2019'
//         }
//       }
//       const mockRes = {
//         json: jest.fn()
//       }
//       const mockResponse = {
//         text:
//           'Datas em formatos inválidos por favor use datas com o formato ex: 10-10-2019',
//         attachments: []
//       }
//       userController.isCoreTeam = jest
//         .fn()
//         .mockReturnValue(new Promise(resolve => resolve(true)))

//       minerController.isMiner = jest
//         .fn()
//         .mockReturnValue(new Promise(resolve => resolve(false)))
//       interaction.engaged(mockReq, mockRes).then(() => {
//         expect(mockRes.json).toHaveBeenCalledWith(mockResponse)
//       })
//       done()
//     })

//     it('should return date begin more than date end', async done => {
//       const mockReq = {
//         body: {
//           ...responseEngagedSlash,
//           begin: '01-02-2019',
//           end: '01-01-2019'
//         }
//       }

//       const mockRes = {
//         json: jest.fn()
//       }

//       const mockResponse = {
//         text: 'Data de ínicio não pode ser maior que data final',
//         attachments: []
//       }

//       minerController.isMiner = jest
//         .fn()
//         .mockReturnValue(new Promise(resolve => resolve(false)))

//       userController.isCoreTeam = jest
//         .fn()
//         .mockReturnValue(new Promise(resolve => resolve(true)))

//       interaction.engaged(mockReq, mockRes).then(() => {
//         expect(mockRes.json).toHaveBeenCalledWith(mockResponse)
//       })
//       done()
//     })

//     it('should return a list users engaged', async done => {
//       const mockUsers = [
//         {
//           _id: {
//             _id: 123456,
//             name: 'Ikki',
//             rocketId: 'H9kcNkWwXF92XxtTF',
//             username: 'ikki'
//           },
//           count: 6,
//           date: '2019-04-13T13:00:12.000Z'
//         }
//       ]
//       const mockReq = {
//         body: responseEngagedSlash
//       }
//       const mockRes = {
//         json: jest.fn()
//       }
//       const mockResponse = {
//         text: 'Total de 1 usuário engajados',
//         attachments: [
//           {
//             text:
//               'Username: @ikki | Name: Ikki | Rocket ID: H9kcNkWwXF92XxtTF | Qtd. interações: 6'
//           }
//         ]
//       }

//       minerController.isMiner = jest
//         .fn()
//         .mockReturnValue(new Promise(resolve => resolve(false)))
//       userController.isCoreTeam = jest
//         .fn()
//         .mockReturnValue(new Promise(resolve => resolve(true)))
//       interaction.mostActives = jest
//         .fn()
//         .mockReturnValue(new Promise(resolve => resolve(mockUsers)))
//       interaction
//         .engaged(mockReq, mockRes)
//         .then(() => {
//           expect(mockRes.json).toHaveBeenCalledWith(mockResponse)
//         })
//         .catch(err => {
//           expect(err).toBeNull()
//         })
//       done()
//     })
//   })

//   describe('checkpoints', () => {
//     beforeEach(() => {
//       api.getChannels = jest
//         .fn()
//         .mockReturnValue(
//           new Promise(resolve => resolve(apiGetChannels.channels))
//         )
//     })
//     describe('week', () => {
//       it('should return a reject promise when not called from an monday', async done => {
//         MockDate.set('04-27-2019')

//         interaction.checkpoints().catch(err => {
//           expect(err).toEqual(
//             'O checkpoint por semana deve ser feito em uma segunda feira'
//           )
//           MockDate.reset()
//           done()
//         })
//       })

//       it('should return a week engaged users to quarterly', async done => {
//         MockDate.set('04-29-2019')
//         const mockUsers = [
//           { id: '1', name: 'Fulano' },
//           { id: '2', name: 'Ciclano' },
//           { id: '3', name: 'Beltrano' }
//         ]

//         interaction.mostActives = jest
//           .fn()
//           .mockReturnValue(new Promise(resolve => resolve(mockUsers)))
//         const spy = jest
//           .spyOn(channelCheckPointModel, 'findOneAndUpdate')
//           .mockImplementationOnce(() => Promise.resolve({}))

//         interaction.checkpoints().then(() => {
//           expect(api.getChannels).toHaveBeenCalled()
//           expect(interaction.mostActives).toHaveBeenCalled()
//           expect(interaction.mostActives).toHaveBeenCalledTimes(4)
//           expect(spy).toHaveBeenCalledTimes(4)
//           expect(spy).toHaveBeenCalled()
//           MockDate.reset()
//           done()
//         })
//       })
//     })

//     describe('quarter', () => {
//       it('should close checkpoint on begin of new quarter', async done => {
//         MockDate.set('04-01-2019')
//         let interactions = []
//         for (let i = 1; i <= 10; i++) {
//           interactions.push({ _id: i, score: 1, channel: 'GENERAL' })
//         }

//         interaction.byChannel = jest
//           .fn()
//           .mockReturnValue(new Promise(resolve => resolve(interactions)))

//         channelCheckPointModel.findOne = jest
//           .fn()
//           .mockResolvedValue({ channel: 'GENERAL' })
//         driver.sendToRoomId = jest.fn().mockResolvedValue({})

//         interaction.checkpoints('quarter').then(() => {
//           expect(api.getChannels).toHaveBeenCalled()
//           expect(interaction.byChannel).toHaveBeenCalledTimes(4)
//           expect(channelCheckPointModel.findOne).toHaveBeenCalledTimes(4)
//           // expect(spy).toHaveBeenCalledTimes(4);
//           // expect(driver.sendToRoomId).toHaveBeenCalledTimes(4);
//           MockDate.reset()
//           done()
//         })
//       })
//     })
//   })
// })
