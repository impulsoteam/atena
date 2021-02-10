import faker from 'faker'

import GeneralRanking from '../../src/models/GeneralRanking'
import LevelHistory from '../../src/models/LevelHistory'
import Login from '../../src/models/Login'
import Message from '../../src/models/Message'
import MonthlyRanking from '../../src/models/MonthlyRanking'
import Reaction from '../../src/models/Reaction'
import Score from '../../src/models/Score'
import User from '../../src/models/User'

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export const getArray = size => Array.from(Array(size).keys())

export const getAnonymizedEmail = () =>
  `anonimo-${faker.random.number()}@impulso.network`

export const clearDatabase = async () => {
  await Message.deleteMany()
  await Score.deleteMany()
  await User.deleteMany()
  await GeneralRanking.deleteMany()
  await LevelHistory.deleteMany()
  await Login.deleteMany()
  await MonthlyRanking.deleteMany()
  await Reaction.deleteMany()
}
