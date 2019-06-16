import utils from './usersUtils'

const updateScore = async (user, score) => {
  if (!user) return

  user.score += score
  user.previousLevel = user.level
  user.level = utils.calculateLevel(user.score)
  await onChangeLevel(user)
  return user.save()
}

const onChangeLevel = async user => {
  if (user.level !== user.previousLevel) {
    // await saveLevelHistoryChanges(this._id, this._previousLevel, this.level)
    // const achievement = await achievementLevelController.save(
    //   this._id,
    //   this._previousLevel,
    //   this.level
    // )

    // const score = getLevelScore(achievement)
    // if (score > 0) {
    //   this.score += score
    //   await saveScoreInteraction(this, achievement, score, 'Conquista de Nível')
    // }

    // await sendLevelMessage(this, achievement)
    // TODO: save historico
    // TODO: save achievement
    // TODO: valida pro
    console.log('Entrou em onChangeLevel')
  }
}

export default {
  updateScore
}
