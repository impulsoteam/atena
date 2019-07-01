import model from './github'

const findAllRepositories = async (query = {}) => {
  const repositories = await model.find(query)
  return repositories.map(row => row.repositoryId)
}

export const getRepository = async repositoryId =>
  model.findOne({ repositoryId: repositoryId })

const getExcludedUsers = async (query = {}) => {
  return model.findOne(query).then(doc => {
    return Promise.resolve(doc.excludedUsers)
  })
}

const findExcludedUser = async (repositoryId, userId) => {
  return model.findOne(
    {
      repositoryId: repositoryId,
      'excludedUsers.userId': userId
    },
    {
      'excludedUsers.$': 1
    }
  )
}

const save = async obj => {
  return model(obj).save()
}

export default {
  findAllRepositories,
  findExcludedUser,
  save
}
