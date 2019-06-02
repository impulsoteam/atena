import UserLevelHistoryModel from "../models/userLevelHistory"

export const save = async (userId, oldLevel, newLevel) => {
  const kind = oldLevel < newLevel ? "added" : "subtracted"
  const historyExistent = await UserLevelHistoryModel.findOne({
    user: userId,
    level: newLevel,
    kind: kind
  }).exec()

  if (!historyExistent && oldLevel != newLevel) {
    const history = new UserLevelHistoryModel({
      user: userId,
      kind: kind,
      level: newLevel,
      earnedDate: Date.now()
    })

    await history.save()
  } else {
    historyExistent.earnedDate = Date.now()
    await historyExistent.save()
  }
}

export default {
  save
}
