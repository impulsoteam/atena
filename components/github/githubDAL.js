import model from './github'

export const getRepositories = async (query = {}) => {
  return model.find(query).then(results => {
    return Promise.resolve(results.map(row => row.repositoryId))
  })
}

export const isValidRepository = async repositoryId => {
  return getRepositories().then(results => {
    return results.includes(repositoryId)
  })
}

export const save = async obj => {
  return model(obj).save()
}
