import model from './github'

export const getRepositories = async (query = {}) => {
  return model.find(query).then(results => {
    return Promise.resolve(results.map(row => row.repositoryId))
  })
}

export const getRepository = async repositoryId =>
  model.findOne({ repositoryId: repositoryId })

export const getExcludedUsers = async (query = {}) => {
  return model.findOne(query).then(doc => {
    return Promise.resolve(doc.excludedUsers)
  })
}

export const isValidRepository = async repositoryId => {
  return getRepositories().then(results => {
    return results.includes(repositoryId)
  })
}

export const isExcludedUser = async (repositoryId, userId) => {
  return model
    .findOne(
      {
        repositoryId: repositoryId,
        'excludedUsers.userId': userId
      },
      {
        'excludedUsers.$': 1
      }
    )
    .then(doc => {
      if (doc === null) {
        return Promise.reject('Usuário não adicionado a lista de excluídos')
      }
      return true
    })
    .catch(() => {
      return false
    })
}

export const save = async obj => {
  return model(obj).save()
}
