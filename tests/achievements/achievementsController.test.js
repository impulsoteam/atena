// import { calculateAchievementsPosition as calc } from './calculateAchievementsPosition'

// describe('Test CalculateAchievementsPosition', () => {
//   const achievements = {
//     name: 'Network | Reações Recebidas',
//     kind: 'network.reaction.received',
//     user: 'UEKPNV91C',
//     total: 1,
//     ratings: []
//   }

//   const ratings = [
//     {
//       name: 'Bronze',
//       xp: 5,
//       ranges: [
//         {
//           name: 'I',
//           value: 1,
//           earnedDate: null
//         },
//         {
//           name: 'II',
//           value: 2,
//           earnedDate: null
//         }
//       ]
//     },
//     {
//       name: 'Prata',
//       xp: 10,
//       ranges: [
//         {
//           name: 'I',
//           value: 3,
//           earnedDate: null
//         },
//         {
//           name: 'II',
//           value: 4,
//           earnedDate: null
//         }
//       ]
//     }
//   ]

//   it('should not undefined', () => {
//     expect(calc).not.toBeUndefined()
//   })

//   describe('Test achievements positions', () => {
//     it('should return an object with first rating.range if was no earnedDate', () => {
//       const ratingWithoutEarnedDate = JSON.parse(JSON.stringify(ratings))
//       achievements.ratings = ratingWithoutEarnedDate
//       const achievementsWithoutEarnedDate = [achievements]

//       const rating = achievementsWithoutEarnedDate[0].ratings[0]
//       const range = rating.ranges[0]

//       const achievementReturn = {
//         name: achievements.name,
//         total: achievements.total,
//         rating: {
//           name: `${rating.name} ${range.name}`,
//           value: range.value
//         }
//       }

//       expect(calc(achievementsWithoutEarnedDate)).toEqual(
//         expect.arrayContaining([achievementReturn])
//       )
//     })

//     it('should return an object with rating.range first earnedDate is null', () => {
//       const ratingWithEarnedDate = JSON.parse(JSON.stringify(ratings))
//       ratingWithEarnedDate[0].ranges[0].earnedDate = Date.now()
//       ratingWithEarnedDate[0].ranges[1].earnedDate = Date.now()
//       achievements.ratings = ratingWithEarnedDate
//       const achievementsWithEarnedDate = [achievements]

//       const rating = achievementsWithEarnedDate[0].ratings[1]
//       const range = rating.ranges[0]

//       const achievement = {
//         name: achievements.name,
//         total: achievements.total,
//         rating: {
//           name: `${rating.name} ${range.name}`,
//           value: range.value
//         }
//       }

//       expect(calc(achievementsWithEarnedDate)).toEqual(
//         expect.arrayContaining([achievement])
//       )
//     })

//     it('should return an object with last rating.range when all earnedDate filled', () => {
//       const ratingWithAllEarnedDate = JSON.parse(JSON.stringify(ratings))
//       const ratingsWithAllEarnedDate = ratingWithAllEarnedDate.map(rating => {
//         rating.ranges = rating.ranges.map(range => {
//           range.earnedDate = Date.now()
//           return range
//         })

//         return rating
//       })

//       achievements.ratings = ratingsWithAllEarnedDate
//       const achievementsWithAllEarnedDate = [achievements]

//       const rating = achievementsWithAllEarnedDate[0].ratings[1]
//       const range = rating.ranges[1]

//       const achievement = {
//         name: achievements.name,
//         total: achievements.total,
//         rating: {
//           name: `${rating.name} ${range.name}`,
//           value: range.value
//         }
//       }

//       expect(calc(achievementsWithAllEarnedDate)).toEqual(
//         expect.arrayContaining([achievement])
//       )
//     })
//   })
// })

// import moment from 'moment-timezone'
// import utils from './achievements'
// import { achievementLevel } from '../mocks/achievements/level'
// import { message } from '../mocks/rocket'
// jest.mock('../rocket/api')
// jest.mock('../rocket/bot', () => jest.fn())

// const today = moment(new Date())
//   .utc()
//   .format()

// describe('[UTILS] Achievement', () => {
//   afterEach(() => jest.restoreAllMocks())

//   describe('getCurrentScoreToIncrease', () => {
//     it('should return score 0 to increase', done => {
//       const score = utils.getCurrentScoreToIncrease(achievementLevel)
//       expect(score).toEqual(0)
//       done()
//     })

//     it("should return bronze's score to increase", done => {
//       let achievementLevelCopy = JSON.parse(JSON.stringify(achievementLevel))
//       achievementLevelCopy.ratings[0].ranges[1].earnedDate = today
//       const score = utils.getCurrentScoreToIncrease(achievementLevelCopy)
//       expect(score).toEqual(achievementLevel.ratings[0].xp)
//       done()
//     })

//     it("should return prata's score to increase", done => {
//       let achievementLevelCopy = JSON.parse(JSON.stringify(achievementLevel))
//       achievementLevelCopy.ratings[0].ranges[1].earnedDate = today
//       achievementLevelCopy.ratings[1].ranges[0].earnedDate = today
//       achievementLevelCopy.ratings[1].ranges[1].earnedDate = today
//       const score = utils.getCurrentScoreToIncrease(achievementLevelCopy)
//       expect(score).toEqual(achievementLevel.ratings[1].xp)
//       done()
//     })
//   })

//   describe('getScoreToIncrease', () => {
//     it('should return score 0 to increase', done => {
//       const score = utils.getScoreToIncrease(achievementLevel)
//       expect(score).toEqual(0)
//       done()
//     })

//     it("should return bronze's score to increase", done => {
//       let achievementLevelCopy = JSON.parse(JSON.stringify(achievementLevel))
//       achievementLevelCopy.ratings[0].ranges[1].earnedDate = today
//       const score = utils.getScoreToIncrease(achievementLevelCopy)
//       expect(score).toEqual(achievementLevel.ratings[0].xp)
//       done()
//     })

//     it("should return bronze's and prata's score to increase", done => {
//       let achievementLevelCopy = JSON.parse(JSON.stringify(achievementLevel))
//       achievementLevelCopy.ratings[0].ranges[1].earnedDate = today
//       achievementLevelCopy.ratings[1].ranges[0].earnedDate = today
//       achievementLevelCopy.ratings[1].ranges[1].earnedDate = today
//       const score = utils.getScoreToIncrease(achievementLevelCopy)
//       const expectResult =
//         achievementLevel.ratings[0].xp + achievementLevel.ratings[1].xp
//       expect(score).toEqual(expectResult)
//       done()
//     })
//   })

//   describe('getInteractionType', () => {
//     it('should return sended to message', done => {
//       let interaction = { ...message }
//       interaction.type = 'message'
//       interaction.action = 'message'
//       const type = utils.getInteractionType(interaction)
//       expect(type).toEqual('sended')
//       done()
//     })

//     it('should return sended to reaction_added', done => {
//       let interaction = { ...message }
//       interaction.type = 'reaction_added'
//       const type = utils.getInteractionType(interaction)
//       expect(type).toEqual('sended')
//       done()
//     })

//     it('should return sended to reaction_removed', done => {
//       let interaction = { ...message }
//       interaction.type = 'reaction_removed'
//       const type = utils.getInteractionType(interaction)
//       expect(type).toEqual('sended')
//       done()
//     })

//     it('should return sended to thread', done => {
//       let interaction = { ...message }
//       interaction.type = 'thread'
//       const type = utils.getInteractionType(interaction)
//       expect(type).toEqual('sended')
//       done()
//     })
//   })

//   describe('getAchievementCurrentRating', () => {
//     it('should return first range of bronze', done => {
//       let achievementLevelCopy = JSON.parse(JSON.stringify(achievementLevel))
//       const currentRating = utils.getAchievementCurrentRating(
//         achievementLevelCopy
//       )
//       const expectResult = {
//         name: undefined,
//         range: 'I',
//         rating: 'Bronze',
//         total: 1,
//         xp: 3
//       }
//       expect(currentRating).toEqual(expectResult)
//       done()
//     })

//     it('should return second range of bronze', done => {
//       let achievementLevelCopy = JSON.parse(JSON.stringify(achievementLevel))
//       achievementLevelCopy.ratings[0].ranges[1].earnedDate = today
//       const currentRating = utils.getAchievementCurrentRating(
//         achievementLevelCopy
//       )
//       const expectResult = {
//         name: undefined,
//         range: 'II',
//         rating: 'Bronze',
//         total: 2,
//         xp: 3
//       }
//       expect(currentRating).toEqual(expectResult)
//       done()
//     })

//     it('should return first range of prata', done => {
//       let achievementLevelCopy = JSON.parse(JSON.stringify(achievementLevel))
//       achievementLevelCopy.ratings[0].ranges[1].earnedDate = today
//       achievementLevelCopy.ratings[1].ranges[0].earnedDate = today
//       const currentRating = utils.getAchievementCurrentRating(
//         achievementLevelCopy
//       )
//       const expectResult = {
//         name: undefined,
//         range: 'I',
//         rating: 'Prata',
//         total: 3,
//         xp: 5
//       }
//       expect(currentRating).toEqual(expectResult)
//       done()
//     })

//     it('should return first range of prata', done => {
//       let achievementLevelCopy = JSON.parse(JSON.stringify(achievementLevel))
//       achievementLevelCopy.ratings[0].ranges[1].earnedDate = today
//       achievementLevelCopy.ratings[1].ranges[0].earnedDate = today
//       achievementLevelCopy.ratings[1].ranges[1].earnedDate = today
//       const currentRating = utils.getAchievementCurrentRating(
//         achievementLevelCopy
//       )
//       const expectResult = {
//         name: undefined,
//         range: 'II',
//         rating: 'Prata',
//         total: 4,
//         xp: 5
//       }
//       expect(currentRating).toEqual(expectResult)
//       done()
//     })
//   })

//   describe('getAchievementNextRating', () => {
//     it('should return second range of bronze', done => {
//       let achievementLevelCopy = JSON.parse(JSON.stringify(achievementLevel))
//       const currentRating = utils.getAchievementNextRating(achievementLevelCopy)
//       const expectResult = {
//         name: undefined,
//         range: 'II',
//         rating: 'Bronze',
//         total: 2,
//         xp: 3
//       }
//       expect(currentRating).toEqual(expectResult)
//       done()
//     })

//     it('should return first range of prata', done => {
//       let achievementLevelCopy = JSON.parse(JSON.stringify(achievementLevel))
//       achievementLevelCopy.ratings[0].ranges[1].earnedDate = today
//       const currentRating = utils.getAchievementNextRating(achievementLevelCopy)
//       const expectResult = {
//         name: undefined,
//         range: 'I',
//         rating: 'Prata',
//         total: 3,
//         xp: 5
//       }
//       expect(currentRating).toEqual(expectResult)
//       done()
//     })

//     it('should return first range of prata', done => {
//       let achievementLevelCopy = JSON.parse(JSON.stringify(achievementLevel))
//       achievementLevelCopy.ratings[0].ranges[1].earnedDate = today
//       achievementLevelCopy.ratings[1].ranges[0].earnedDate = today
//       const currentRating = utils.getAchievementNextRating(achievementLevelCopy)
//       const expectResult = {
//         name: undefined,
//         range: 'II',
//         rating: 'Prata',
//         total: 4,
//         xp: 5
//       }
//       expect(currentRating).toEqual(expectResult)
//       done()
//     })
//   })

//   describe('getLevelRecord', () => {
//     it('should return current record', done => {
//       let achievementLevelCopy = JSON.parse(JSON.stringify(achievementLevel))
//       const currentRating = utils.getLevelRecord(achievementLevelCopy)
//       expect(currentRating).toEqual(achievementLevel.record)
//       done()
//     })

//     it('should return first range of bronze as record', done => {
//       let achievementLevelCopy = JSON.parse(JSON.stringify(achievementLevel))
//       delete achievementLevelCopy.record
//       const currentRating = utils.getLevelRecord(achievementLevelCopy)
//       const expectResult = {
//         name: 'Bronze',
//         range: 'I',
//         level: 1,
//         earnedDate: today
//       }
//       expect(currentRating).toEqual(expectResult)
//       done()
//     })

//     it('should return second range of bronze as record', done => {
//       let achievementLevelCopy = JSON.parse(JSON.stringify(achievementLevel))
//       achievementLevelCopy.ratings[0].ranges[1].earnedDate = today
//       const currentRating = utils.getLevelRecord(achievementLevelCopy)
//       const expectResult = {
//         name: 'Bronze',
//         range: 'II',
//         level: 2,
//         earnedDate: today
//       }
//       expect(currentRating).toEqual(expectResult)
//       done()
//     })

//     it('should return first range of prata as record', done => {
//       let achievementLevelCopy = JSON.parse(JSON.stringify(achievementLevel))
//       achievementLevelCopy.ratings[0].ranges[1].earnedDate = today
//       achievementLevelCopy.ratings[1].ranges[0].earnedDate = today
//       const currentRating = utils.getLevelRecord(achievementLevelCopy)
//       const expectResult = {
//         name: 'Prata',
//         range: 'I',
//         level: 3,
//         earnedDate: today
//       }
//       expect(currentRating).toEqual(expectResult)
//       done()
//     })

//     it('should return second range of prata as record', done => {
//       let achievementLevelCopy = JSON.parse(JSON.stringify(achievementLevel))
//       achievementLevelCopy.ratings[0].ranges[1].earnedDate = today
//       achievementLevelCopy.ratings[1].ranges[0].earnedDate = today
//       achievementLevelCopy.ratings[1].ranges[1].earnedDate = today
//       const currentRating = utils.getLevelRecord(achievementLevelCopy)
//       const expectResult = {
//         name: 'Prata',
//         range: 'II',
//         level: 4,
//         earnedDate: today
//       }
//       expect(currentRating).toEqual(expectResult)
//       done()
//     })

//     it('should return first range of ouro as record', done => {
//       let achievementLevelCopy = JSON.parse(JSON.stringify(achievementLevel))
//       achievementLevelCopy.ratings[0].ranges[1].earnedDate = today
//       achievementLevelCopy.ratings[1].ranges[0].earnedDate = today
//       achievementLevelCopy.ratings[1].ranges[1].earnedDate = today
//       achievementLevelCopy.ratings[2].ranges[0].earnedDate = today
//       const currentRating = utils.getLevelRecord(achievementLevelCopy)
//       const expectResult = {
//         name: 'Ouro',
//         range: 'I',
//         level: 5,
//         earnedDate: today
//       }
//       expect(currentRating).toEqual(expectResult)
//       done()
//     })
//   })
// })
