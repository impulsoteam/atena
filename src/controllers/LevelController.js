// import { levelsList } from '../config/achievements'
// import BotController from './BotController'
// import { generateStorytelling } from '../assets/storytelling'
// import moment from 'moment'
// import User from '../models/User'

// class LevelController {
//   async update({ provider, score, user }) {
//     const [currentStatus = { level: 0 }] = user.achievements.filter(
//       ({ name }) => name === 'userLevel'
//     )

//     const updatedStatus = this.updateStatus({ currentStatus, score })

//     const othersAchievements = user.achievements.filter(
//       ({ name }) => name !== 'userLevel'
//     )

//     if (currentStatus.level < updatedStatus.level) {
//       const username = user[provider].username
//       const message = generateStorytelling({
//         username,
//         level: updatedStatus.level
//       })
//       BotController.sendMessageToUser({ provider, message, username })
//     }

//     return User.updateAchievements({
//       uuid: user.uuid,
//       achievements: [...othersAchievements, updatedStatus]
//     })
//   }

//   updateStatus({ currentStatus, score: scoreGained }) {
//     const levels = levelsList()

//     if (!currentStatus.level)
//       return {
//         name: levels[0].name,
//         level: 1,
//         score: scoreGained,
//         scoreToNextLevel: levels[0].scoreToNextLevel,
//         earnedIn: moment().toDate()
//       }

//     const newStatus = Object.assign({}, currentStatus)

//     newStatus.score += scoreGained

//     if (newStatus.score >= newStatus.scoreToNextLevel) {
//       for (const { level, scoreToNextLevel } of levels) {
//         if (level > newStatus.level) {
//           newStatus.level = level
//           newStatus.earnedIn = moment().toDate()
//           newStatus.scoreToNextLevel = scoreToNextLevel
//           break
//         }
//       }

//       // if (newStatus.score <= scoreToNextLevel && level !== newStatus.level) {
//       //   const newAchievement = levels[index - 1]

//       //   newStatus.level = newAchievement.level
//       //   newStatus.earnedIn = moment().toDate()
//       //   newStatus.scoreToNextLevel = scoreToNextLevel
//       //   break
//       // }
//     }
//     return newStatus
//   }
// }

// export default new LevelController()
