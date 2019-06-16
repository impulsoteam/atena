import userController from '../../controllers/user'
import achievementController from '../../controllers/achievement'
import achievementTemporaryController from '../../controllers/achievementTemporary'

const userUpdateScoreLevel = async data => {
  return userController.findBy({ rocketId: data.user }).then(user => {
    return userController.updateScore(user, data.score)
  })
}

const achievementSave = async (interaction, user) => {
  return achievementController.save(interaction, user).then(() => {
    return achievementTemporaryController.save(interaction)
  })
}

const defaultFunctions = { userUpdateScoreLevel, achievementSave }

export default defaultFunctions
