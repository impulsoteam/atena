import config from "config-yml"

export const isValidRepository = repository => {
  let validRepositories = []
  if (process.env.NODE_ENV !== "production") {
    validRepositories = process.env.GITHUB_REPOSITORIES.split(" ")
  } else {
    validRepositories = config.github.valid_repositories
  }
  const isValid = validRepositories.find(item => item === repository)

  return !!isValid
}

export default isValidRepository
