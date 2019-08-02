import model from './github'

const findAllRepositories = async (query = {}) => {
  const repositories = await model.find(query)
  return repositories.map(row => row.repositoryId)
}

const findRepositoryById = async repositoryId => {
  return model.findOne({ repositoryId: repositoryId })
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
  findRepositoryById,
  save
}
